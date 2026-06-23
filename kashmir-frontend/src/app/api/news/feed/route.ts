import { NextResponse } from 'next/server';
import { fetchKashmirNews } from '@/server/news';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* GET /api/news/feed — { articles: NewsItem[], last_updated } */
export async function GET() {
  const data = await fetchKashmirNews();
  return NextResponse.json(data);
}
