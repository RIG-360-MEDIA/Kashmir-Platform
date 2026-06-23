import { NextResponse } from 'next/server';
import { verifyPayment } from '@/server/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* POST /api/payment/verify  body: { razorpay_order_id, razorpay_payment_id, razorpay_signature } */
export async function POST(request: Request) {
  const body = await request.json();
  const result = await verifyPayment({
    razorpay_order_id: body.razorpay_order_id,
    razorpay_payment_id: body.razorpay_payment_id,
    razorpay_signature: body.razorpay_signature,
  });
  return NextResponse.json(result);
}
