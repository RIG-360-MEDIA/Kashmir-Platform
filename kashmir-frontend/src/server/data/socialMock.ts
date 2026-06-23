/**
 * Mock social posts — server data.
 * Ported verbatim from the former `social_scraper.py::_build_mock_posts()`.
 * Timestamps are generated fresh on each call (relative to now), exactly as the
 * Python version did, so the feed always reads as "recent".
 */

export interface ServerSocialPost {
  platform: string;
  author: string;
  author_handle: string;
  author_avatar: string | null;
  content: string;
  media_url: string | null;
  post_url: string;
  likes: number;
  comments: number;
  shares: number;
  posted_at: string | null;
}

const IG = 'https://www.instagram.com/explore/tags/kashmir/';
const TW = 'https://x.com/search?q=%23Kashmir&src=typed_query&f=live';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const daysAgo  = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export function buildMockPosts(): ServerSocialPost[] {
  return [
    {
      platform: 'instagram', author: 'Kashmir Valley Journal', author_handle: '@kashmirvalleyjournal',
      author_avatar: null,
      content: 'The shikaras on Dal Lake at golden hour are simply unmatched. No photograph does justice to the light here — it has to be lived. #Kashmir #DalLake #Paradise #KashmirValley',
      media_url: null, post_url: IG, likes: 4821, comments: 234, shares: 0, posted_at: hoursAgo(2),
    },
    {
      platform: 'twitter', author: 'Tariq Mir', author_handle: '@tariqmir_jk',
      author_avatar: null,
      content: "Watching the Kashmir — Fighting for Peace documentary. It's rare to see our stories told with this much care and nuance. The voices of ordinary Kashmiris finally getting the space they deserve. #KashmirFightingForPeace",
      media_url: null, post_url: TW, likes: 1293, comments: 87, shares: 412, posted_at: hoursAgo(5),
    },
    {
      platform: 'instagram', author: 'Saffron Fields', author_handle: '@saffronfields_kashmir',
      author_avatar: null,
      content: "Harvest season in Pampore — the world's most prized saffron comes from these fields. Generations of Kashmiri farmers have tended this land through everything. #KashmirSaffron #Pampore #Agriculture",
      media_url: null, post_url: IG, likes: 3107, comments: 156, shares: 0, posted_at: hoursAgo(8),
    },
    {
      platform: 'twitter', author: 'Rafia Akhter', author_handle: '@rafiaakhter',
      author_avatar: null,
      content: "The documentary raises uncomfortable questions about how the international media covers Kashmir. We're so used to conflict framing — seeing the culture, the art, the daily life is a powerful reframe. #KashmirFightingForPeace",
      media_url: null, post_url: TW, likes: 876, comments: 43, shares: 231, posted_at: hoursAgo(11),
    },
    {
      platform: 'instagram', author: 'Kashmir Through a Lens', author_handle: '@kashmir_lens',
      author_avatar: null,
      content: 'Early morning mist over Wular Lake. The largest freshwater lake in the subcontinent, and one of the most serene places I\'ve ever stood. Kashmir holds its beauty quietly. #WularLake #KashmirPhotography',
      media_url: null, post_url: IG, likes: 6540, comments: 312, shares: 0, posted_at: hoursAgo(14),
    },
    {
      platform: 'twitter', author: 'South Asia Monitor', author_handle: '@southasiamonitor',
      author_avatar: null,
      content: "'Kashmir — Fighting for Peace' brings to screen testimonies that have been largely absent from mainstream discourse. A significant contribution to the historical record. #Kashmir #Documentary #SouthAsia",
      media_url: null, post_url: TW, likes: 2341, comments: 189, shares: 654, posted_at: hoursAgo(18),
    },
    {
      platform: 'instagram', author: 'Himalayan Heritage', author_handle: '@himalayan.heritage',
      author_avatar: null,
      content: "The Shankaracharya Temple, perched 1,000 feet above Srinagar. One of the oldest Hindu shrines in Kashmir, a reminder of the region's layered spiritual history. #Kashmir #History #Srinagar",
      media_url: null, post_url: IG, likes: 5212, comments: 278, shares: 0, posted_at: hoursAgo(22),
    },
    {
      platform: 'twitter', author: 'Noor Hussain', author_handle: '@noorhussain_k',
      author_avatar: null,
      content: 'People often ask me what Kashmir is like. I tell them: it\'s the most beautiful place I\'ve ever been, and the most complicated. Both things are completely true at the same time. #Kashmir',
      media_url: null, post_url: TW, likes: 3892, comments: 204, shares: 987, posted_at: daysAgo(1),
    },
  ];
}
