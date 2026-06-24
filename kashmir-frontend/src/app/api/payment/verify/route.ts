import { NextResponse } from 'next/server';
import { verifyAirpayCallback } from '@/server/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* POST /api/payment/verify — verify Airpay callback data manually (JSON) */
export async function POST(request: Request) {
  const body = await request.json();
  const result = await verifyAirpayCallback(body);
  return NextResponse.json(result);
}
