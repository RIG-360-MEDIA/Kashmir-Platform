import { NextResponse } from 'next/server';
import { fetchSocialFeed } from '@/server/social';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* GET /api/social/feed?platform=instagram|twitter — { posts, last_updated, total } */
export async function GET(request: Request) {
  const platform = new URL(request.url).searchParams.get('platform');
  const data = await fetchSocialFeed(platform);
  return NextResponse.json(data);
}
