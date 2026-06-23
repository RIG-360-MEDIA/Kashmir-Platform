/**
 * API Layer — all calls to the FastAPI backend.
 * Base URL from config (defaults to http://localhost:8000).
 * Each function returns null on network failure so callers fall back to mock data.
 *
 * Transform functions map backend field names → frontend TypeScript type field names.
 * Backend and frontend use different naming conventions; transforms live here so
 * components and mock data never have to change.
 */
import { CONFIG } from '@/lib/config';
import type {
  TimelineResponse, NewsResponse, SocialResponse,
  DocumentaryTimestamps, PaymentOrder, PaymentVerification,
  AccessToken, AccessVerification,
} from '@/types/api';

const BASE = `${CONFIG.api.baseUrl}${CONFIG.api.prefix}`;

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(CONFIG.api.timeoutMs),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   TRANSFORMS
   Backend returns snake_case field names that differ from our
   frontend TypeScript types. These functions normalise the shape
   so components always receive the type they expect.
───────────────────────────────────────────────────────────── */

function transformNewsResponse(raw: Record<string, unknown>): NewsResponse | null {
  if (!Array.isArray(raw?.articles)) return null;
  return {
    articles: (raw.articles as Record<string, unknown>[]).map((item, i) => ({
      id:           `${String(item.source_url ?? 'news')}-${i}`,
      title:        String(item.headline ?? ''),
      summary:      String(item.brief ?? ''),
      source:       String(item.source_name ?? ''),
      url:          String(item.source_url ?? '#'),
      published_at: String(item.published_at ?? new Date().toISOString()),
      image_url:    item.image_url ? String(item.image_url) : undefined,
      category:     item.category  ? String(item.category)  : undefined,
    })),
    fetched_at: String(raw.last_updated ?? new Date().toISOString()),
  };
}

function transformSocialResponse(raw: Record<string, unknown>): SocialResponse | null {
  if (!Array.isArray(raw?.posts)) return null;
  return {
    posts: (raw.posts as Record<string, unknown>[]).map((post, i) => ({
      id:         `${String(post.post_url ?? 'post')}-${i}`,
      platform:   (post.platform as 'instagram' | 'twitter' | 'facebook') ?? 'twitter',
      handle:     String(post.author_handle ?? ''),
      name:       String(post.author ?? ''),
      content:    String(post.content ?? ''),
      image_url:  post.media_url ? String(post.media_url) : undefined,
      likes:      Number(post.likes ?? 0),
      comments:   Number(post.comments ?? 0),
      url:        String(post.post_url ?? '#'),
      posted_at:  String(post.posted_at ?? new Date().toISOString()),
    })),
    fetched_at: String(raw.last_updated ?? new Date().toISOString()),
  };
}

function transformPaymentOrder(raw: Record<string, unknown>): PaymentOrder | null {
  if (!raw?.order_id) return null;
  return {
    order_id: String(raw.order_id),
    amount:   Number(raw.amount),
    currency: String(raw.currency),
    key_id:   String(raw.razorpay_key_id ?? ''),
  };
}

/* ─────────────────────────────────────────────────────────────
   API CALLS
───────────────────────────────────────────────────────────── */

export const api = {
  /* Documentary — field names match backend directly */
  timeline:   () => get<TimelineResponse>('/documentary/timeline'),
  timestamps: () => get<DocumentaryTimestamps>('/documentary/timestamps'),

  /* News — backend endpoint is /news/feed, fields are transformed */
  news: async (): Promise<NewsResponse | null> => {
    try {
      const res = await fetch(`${BASE}/news/feed`, {
        next: { revalidate: 900 },
        signal: AbortSignal.timeout(CONFIG.api.timeoutMs),
      });
      if (!res.ok) return null;
      return transformNewsResponse(await res.json());
    } catch { return null; }
  },

  /* Social — backend endpoint is /social/feed, fields are transformed */
  social: async (): Promise<SocialResponse | null> => {
    try {
      const res = await fetch(`${BASE}/social/feed`, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(CONFIG.api.timeoutMs),
      });
      if (!res.ok) return null;
      return transformSocialResponse(await res.json());
    } catch { return null; }
  },

  /* Payment — create order; backend requires both email AND name */
  createOrder: async (email: string, name: string): Promise<PaymentOrder | null> => {
    try {
      const res = await fetch(`${BASE}/payment/create-order`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, name }),
      });
      if (!res.ok) return null;
      return transformPaymentOrder(await res.json());
    } catch { return null; }
  },

  /* Payment — verify Razorpay signature, receive JWT */
  verifyPayment: async (data: PaymentVerification): Promise<AccessToken | null> => {
    try {
      const res = await fetch(`${BASE}/payment/verify`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      if (!res.ok) return null;
      return (await res.json()) as AccessToken;
    } catch { return null; }
  },

  /* Payment — verify JWT; backend is GET with Authorization header (not POST) */
  verifyAccess: async (token: string): Promise<AccessVerification | null> => {
    try {
      const res = await fetch(`${BASE}/payment/verify-access`, {
        method:  'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return (await res.json()) as AccessVerification;
    } catch { return null; }
  },
};
