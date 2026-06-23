import { NextResponse } from 'next/server';
import { TIMESTAMP_MARKERS } from '@/server/data/timestamps';

/* GET /api/documentary/timestamps — { markers: TimestampMarker[] } */
export async function GET() {
  return NextResponse.json({ markers: TIMESTAMP_MARKERS });
}
