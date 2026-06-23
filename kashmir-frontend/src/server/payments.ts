/**
 * Payment service — port of `payments.py`.
 *
 * - createOrder:  creates a Razorpay order (official Node SDK).
 * - verifyPayment: validates the Razorpay HMAC-SHA256 signature, then issues a
 *                  signed JWT access token (HS256), identical to the Python flow.
 * - verifyAccessToken: verifies/decodes the JWT.
 *
 * The HMAC body, hashing, and JWT claims (sub = payment id, exp) match the original
 * exactly, so tokens are interchangeable with the former backend when secrets match.
 */
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { getServerSettings } from '@/server/config';

export interface CreateOrderResult {
  order_id: string;
  amount: number;
  currency: string;
  razorpay_key_id: string;
}

export interface VerifyPaymentInput {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResult {
  verified: boolean;
  access_token?: string;
  message: string;
}

export async function createOrder(email: string, name: string): Promise<CreateOrderResult> {
  const s = getServerSettings();
  const instance = new Razorpay({ key_id: s.razorpayKeyId, key_secret: s.razorpayKeySecret });
  const order = await instance.orders.create({
    amount: s.documentaryPriceInr * 100, // paise
    currency: 'INR',
    payment_capture: true,
    notes: { email, name },
  });
  return {
    order_id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    razorpay_key_id: s.razorpayKeyId,
  };
}

export async function verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
  const s = getServerSettings();
  const body = `${input.razorpay_order_id}|${input.razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', s.razorpayKeySecret).update(body).digest('hex');

  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(input.razorpay_signature);
  const valid = expectedBuf.length === providedBuf.length &&
    crypto.timingSafeEqual(expectedBuf, providedBuf);

  if (!valid) {
    return { verified: false, message: 'Invalid signature' };
  }

  const key = new TextEncoder().encode(s.jwtSecret);
  const expSeconds = Math.floor(Date.now() / 1000) + s.accessTokenExpireMinutes * 60;
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: s.jwtAlgorithm })
    .setSubject(input.razorpay_payment_id)
    .setExpirationTime(expSeconds)
    .sign(key);

  return { verified: true, access_token: token, message: 'Payment verified' };
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  const s = getServerSettings();
  try {
    const key = new TextEncoder().encode(s.jwtSecret);
    const { payload } = await jwtVerify(token, key, { algorithms: [s.jwtAlgorithm] });
    return payload;
  } catch {
    return null;
  }
}
