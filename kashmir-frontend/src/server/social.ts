/**
 * Social feed service — port of `social_scraper.py`.
 *
 * Fetches Kashmir-related posts via Apify actors when APIFY_API_TOKEN is set;
 * otherwise (and on any failure) falls back to curated mock posts. Results are
 * cached for 30 minutes, mirroring the original TTLCache(ttl=1800).
 */
import { getServerSettings } from '@/server/config';
import { TTLCache } from '@/server/cache';
import { buildMockPosts, type ServerSocialPost } from '@/server/data/socialMock';

export interface SocialFeedResponse {
  posts: ServerSocialPost[];
  last_updated: string;
  total: number;
}

const cache = new TTLCache<SocialFeedResponse>(1800_000);

const APIFY_BASE = 'https://api.apify.com/v2';
const INSTAGRAM_ACTOR = 'apify~instagram-hashtag-scraper';
const TWITTER_ACTOR = 'apify~tweet-scraper';

const KASHMIR_HASHTAGS = ['kashmir', 'kashmirdocumentary', 'kashmirvalley', 'freeKashmir'];
const KASHMIR_SEARCH_TERMS = ['Kashmir', 'Kashmir documentary', 'Kashmir conflict'];

type ApifyItem = Record<string, unknown>;

/** Run an Apify actor synchronously (waits for finish) and return dataset items. */
async function runActor(actorId: string, runInput: Record<string, unknown>): Promise<ApifyItem[]> {
  const { apifyApiToken } = getServerSettings();
  const controller = AbortSignal.timeout(120_000);

  const runResp = await fetch(
    `${APIFY_BASE}/acts/${actorId}/runs?token=${encodeURIComponent(apifyApiToken)}&waitForFinish=60`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(runInput), signal: controller },
  );
  if (!runResp.ok) throw new Error(`Apify run failed: ${runResp.status}`);
  const runData = (await runResp.json())?.data;
  const datasetId = runData?.defaultDatasetId;
  if (!datasetId) return [];

  const itemsResp = await fetch(
    `${APIFY_BASE}/datasets/${datasetId}/items?token=${encodeURIComponent(apifyApiToken)}&limit=30`,
    { signal: AbortSignal.timeout(120_000) },
  );
  if (!itemsResp.ok) throw new Error(`Apify dataset fetch failed: ${itemsResp.status}`);
  return itemsResp.json();
}

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}
function num(v: unknown): number {
  return typeof v === 'number' ? v : 0;
}

function parseInstagramItem(item: ApifyItem): ServerSocialPost {
  return {
    platform: 'instagram',
    author: str(item.ownerFullName, 'Unknown'),
    author_handle: str(item.ownerUsername),
    author_avatar: item.profilePicUrl ? str(item.profilePicUrl) : null,
    content: str(item.caption).slice(0, 500),
    media_url: (item.displayUrl || item.url) ? str(item.displayUrl || item.url) : null,
    post_url: str(item.url),
    likes: num(item.likesCount),
    comments: num(item.commentsCount),
    shares: 0,
    posted_at: item.timestamp ? str(item.timestamp) : null,
  };
}

function parseTwitterItem(item: ApifyItem): ServerSocialPost {
  const author = (item.author ?? {}) as Record<string, unknown>;
  const media = Array.isArray(item.media) ? (item.media as Record<string, unknown>[]) : [];
  return {
    platform: 'twitter',
    author: str(author.name, 'Unknown'),
    author_handle: str(author.userName),
    author_avatar: author.profilePicture ? str(author.profilePicture) : null,
    content: str(item.text).slice(0, 500),
    media_url: media[0]?.url ? str(media[0].url) : null,
    post_url: str(item.url),
    likes: num(item.likeCount),
    comments: num(item.replyCount),
    shares: num(item.retweetCount),
    posted_at: item.createdAt ? str(item.createdAt) : null,
  };
}

const tsOf = (p: ServerSocialPost) => (p.posted_at ? new Date(p.posted_at).getTime() : 0);

export async function fetchSocialFeed(platform?: string | null): Promise<SocialFeedResponse> {
  const cacheKey = `social_${platform ?? 'all'}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const settings = getServerSettings();
  const useMock = !settings.apifyApiToken;
  let posts: ServerSocialPost[] = [];

  if (!useMock) {
    if (platform === null || platform === undefined || platform === 'instagram') {
      try {
        const igItems = await runActor(INSTAGRAM_ACTOR, { hashtags: KASHMIR_HASHTAGS, resultsLimit: 20 });
        posts.push(...igItems.map(parseInstagramItem));
      } catch (e) { console.error('[Apify] Instagram fetch failed:', e); }
    }
    if (platform === null || platform === undefined || platform === 'twitter') {
      try {
        const twItems = await runActor(TWITTER_ACTOR, { searchTerms: KASHMIR_SEARCH_TERMS, maxTweets: 20, sort: 'Latest' });
        posts.push(...twItems.map(parseTwitterItem));
      } catch (e) { console.error('[Apify] Twitter fetch failed:', e); }
    }
  }

  if (useMock || posts.length === 0) {
    const mock = buildMockPosts();
    posts = platform == null ? mock : mock.filter(p => p.platform === platform);
  }

  posts.sort((a, b) => tsOf(b) - tsOf(a));

  const result: SocialFeedResponse = {
    posts,
    last_updated: new Date().toISOString(),
    total: posts.length,
  };
  cache.set(cacheKey, result);
  return result;
}
