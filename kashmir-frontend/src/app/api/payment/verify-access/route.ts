import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/server/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* GET /api/payment/verify-access  header: Authorization: Bearer <token> */
export async function GET(request: Request) {
  const authorization = request.headers.get('authorization') ?? '';
  const token = authorization.replace('Bearer ', '');
  const claims = await verifyAccessToken(token);
  if (!claims) {
    return NextResponse.json(
      { detail: 'Invalid or expired access token' },
      { status: 401 },
    );
  }
  return NextResponse.json({ valid: true, expires: claims.exp });
}
