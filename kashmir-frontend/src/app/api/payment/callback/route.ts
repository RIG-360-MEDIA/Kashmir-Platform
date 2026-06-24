import { NextResponse } from 'next/server';
import { verifyAirpayCallback } from '@/server/payments';
import { getServerSettings } from '@/server/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* POST /api/payment/callback — Airpay redirects here after payment */
export async function POST(request: Request) {
  const s = getServerSettings();
  const formData = await request.formData();
  const data: Record<string, string> = {};
  formData.forEach((value, key) => {
    data[key] = String(value);
  });

  const result = await verifyAirpayCallback(data);

  if (result.verified && result.access_token) {
    return NextResponse.redirect(
      `${s.frontendUrl}/?payment=success&token=${result.access_token}#watch`,
      { status: 303 },
    );
  }

  return NextResponse.redirect(
    `${s.frontendUrl}/?payment=failed#watch`,
    { status: 303 },
  );
}
