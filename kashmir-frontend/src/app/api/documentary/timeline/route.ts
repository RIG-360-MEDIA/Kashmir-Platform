import { NextResponse } from 'next/server';
import { TIMELINE_EVENTS } from '@/server/data/timeline';

/* GET /api/documentary/timeline — { events: TimelineEvent[] } */
export async function GET() {
  return NextResponse.json({ events: TIMELINE_EVENTS });
}
