/**
 * Kashmir news aggregator — port of `news_aggregator.py`.
 *
 * Fetches 5 RSS feeds concurrently, keyword-filters non-local feeds for Kashmir
 * relevance, strips HTML into a short brief, deduplicates by headline, sorts by
 * recency, caps at 30, and caches for 15 minutes. Falls back to NewsAPI when RSS
 * yields fewer than 5 articles and NEWS_API_KEY is set.
 */
import Parser from 'rss-parser';
import { getServerSettings } from '@/server/config';
import { TTLCache } from '@/server/cache';

export interface NewsItem {
  headline: string;
  brief: string;
  source_name: string;
  source_url: string;
  image_url: string | null;
  published_at: string | null;
  category: string | null;
}

export interface NewsFeedResponse {
  articles: NewsItem[];
  last_updated: string;
}

const cache = new TTLCache<NewsFeedResponse>(900_000);

interface FeedConfig { name: string; url: string; category: string; }

const RSS_FEEDS: FeedConfig[] = [
  { name: 'Greater Kashmir',    url: 'https://www.greaterkashmir.com/feed',                category: 'local' },
  { name: 'Kashmir Observer',   url: 'https://kashmirobserver.net/feed',                   category: 'local' },
  { name: 'The Wire - Kashmir', url: 'https://thewire.in/category/security/feed',          category: 'security' },
  { name: 'NDTV - Kashmir',     url: 'https://feeds.feedburner.com/ndtvnews-india-news',   category: 'national' },
  { name: 'Al Jazeera - India', url: 'https://www.aljazeera.com/xml/rss/all.xml',          category: 'international' },
];

const KASHMIR_KEYWORDS = [
  // Core geography
  'kashmir', 'jammu', 'srinagar', 'ladakh', 'kupwara', 'baramulla',
  'anantnag', 'pulwama', 'shopian', 'bandipora', 'ganderbal',
  'kargil', 'leh', 'poonch', 'rajouri', 'doda', 'kishtwar', 'udhampur',
  // Regions / alternate naming
  'jammu and kashmir', 'jk', 'j&k', 'kashmir valley',
  // Political / legal
  'article 370', 'article 35a', 'delimitation', 'statehood',
  'assembly elections', 'lg administration', 'lieutenant governor',
  'home ministry', 'governor rule',
  // Security / conflict
  'loc', 'line of control', 'cross border', 'ceasefire',
  'militancy', 'militant', 'terror attack', 'encounter',
  'gunfight', 'infiltration', 'insurgency', 'operation all out',
  'army', 'crpf', 'bsf', 'paramilitary', 'security forces',
  'ied blast', 'grenade attack',
  // Major incidents / context
  'pulwama attack', 'amarnath yatra attack', 'shopian encounter',
  // International / geopolitics
  'india pakistan', 'pakistan occupied kashmir', 'pok',
  'china ladakh', 'galwan', 'lacc', 'border dispute',
  // Society / protests
  'protest', 'shutdown', 'curfew', 'stone pelting',
  'internet shutdown', 'restrictions',
  // Tourism & economy
  'tourism', 'gulmarg', 'pahalgam', 'sonmarg', 'houseboat',
  'dal lake', 'shikara', 'apple harvest', 'saffron', 'handicrafts',
  // Weather / environment
  'snowfall', 'avalanche', 'cold wave', 'floods', 'rainfall',
  // Misc
  'kashmiri pandits', 'migration', 'return policy',
];

function isKashmirRelated(title: string, summary: string): boolean {
  const text = `${title} ${summary}`.toLowerCase();
  return KASHMIR_KEYWORDS.some(kw => text.includes(kw));
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#39;': "'", '&apos;': "'", '&nbsp;': ' ',
};

/** Strip HTML tags and decode common entities — mirrors BeautifulSoup.get_text(). */
function stripHtml(html: string): string {
  let text = html.replace(/<[^>]*>/g, ' ');
  text = text.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)));
  text = text.replace(/&[a-zA-Z]+;|&#\d+;/g, m => ENTITIES[m] ?? m);
  return text.replace(/\s+/g, ' ').trim();
}

function truncateBrief(text: string, maxWords = 35): string {
  const clean = stripHtml(text);
  const words = clean.split(' ').filter(Boolean);
  if (words.length <= maxWords) return clean;
  return words.slice(0, maxWords).join(' ') + '...';
}

type RssItem = {
  title?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  link?: string;
  isoDate?: string;
  mediaContent?: { $?: { url?: string } }[];
  mediaThumbnail?: { $?: { url?: string } }[];
};

const parser: Parser<unknown, RssItem> = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KashmirDocBot/1.0; +news-aggregator)' },
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
    ],
  },
});

async function fetchRssFeed(feed: FeedConfig): Promise<NewsItem[]> {
  const items: NewsItem[] = [];
  try {
    const parsed = await parser.parseURL(feed.url);
    for (const entry of (parsed.items ?? []).slice(0, 20)) {
      const title = entry.title ?? '';
      const summaryRaw = entry.content || entry.contentSnippet || entry.summary || '';

      if (feed.category !== 'local' && !isKashmirRelated(title, summaryRaw)) continue;

      const imageUrl =
        entry.mediaContent?.[0]?.$?.url ??
        entry.mediaThumbnail?.[0]?.$?.url ??
        null;

      items.push({
        headline: title,
        brief: truncateBrief(summaryRaw),
        source_name: feed.name,
        source_url: entry.link ?? '',
        image_url: imageUrl,
        published_at: entry.isoDate ?? null,
        category: feed.category,
      });
    }
  } catch (e) {
    console.error(`[News] Failed to fetch ${feed.name}:`, (e as Error).message);
  }
  return items;
}

async function fetchNewsApiFallback(): Promise<NewsItem[]> {
  const { newsApiKey } = getServerSettings();
  if (!newsApiKey) return [];
  const items: NewsItem[] = [];
  try {
    const params = new URLSearchParams({
      q: 'Kashmir', sortBy: 'publishedAt', pageSize: '15', apiKey: newsApiKey,
    });
    const resp = await fetch(`https://newsapi.org/v2/everything?${params}`, { signal: AbortSignal.timeout(15000) });
    if (!resp.ok) throw new Error(`NewsAPI ${resp.status}`);
    const data = await resp.json();
    for (const article of (data.articles ?? [])) {
      items.push({
        headline: article.title ?? '',
        brief: truncateBrief(article.description ?? ''),
        source_name: article.source?.name ?? 'Unknown',
        source_url: article.url ?? '',
        image_url: article.urlToImage ?? null,
        published_at: article.publishedAt ?? null,
        category: 'general',
      });
    }
  } catch (e) {
    console.error('[NewsAPI] Fallback failed:', (e as Error).message);
  }
  return items;
}

export async function fetchKashmirNews(): Promise<NewsFeedResponse> {
  const cacheKey = 'kashmir_news';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const allArticles: NewsItem[] = [];
  const results = await Promise.allSettled(RSS_FEEDS.map(fetchRssFeed));
  for (const r of results) {
    if (r.status === 'fulfilled') allArticles.push(...r.value);
  }

  if (allArticles.length < 5) {
    allArticles.push(...await fetchNewsApiFallback());
  }

  // Deduplicate by headline (first 60 chars, lowercased)
  const seen = new Set<string>();
  const unique: NewsItem[] = [];
  for (const article of allArticles) {
    const key = article.headline.toLowerCase().trim().slice(0, 60);
    if (!seen.has(key)) { seen.add(key); unique.push(article); }
  }

  // Sort by recency (nulls last)
  unique.sort((a, b) => {
    const ta = a.published_at ? new Date(a.published_at).getTime() : -Infinity;
    const tb = b.published_at ? new Date(b.published_at).getTime() : -Infinity;
    return tb - ta;
  });

  const result: NewsFeedResponse = {
    articles: unique.slice(0, 30),
    last_updated: new Date().toISOString(),
  };
  cache.set(cacheKey, result);
  return result;
}
