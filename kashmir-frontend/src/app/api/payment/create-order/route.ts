import { NextResponse } from 'next/server';
import { createOrder } from '@/server/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* POST /api/payment/create-order  body: { email, name } */
export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    const result = await createOrder(email, name);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { detail: `Failed to create order: ${(e as Error).message}` },
      { status: 500 },
    );
  }
}
