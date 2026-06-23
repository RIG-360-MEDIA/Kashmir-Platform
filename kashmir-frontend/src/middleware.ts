import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/*
 * Kashmir Harvest shop is preserved but not yet public.
 * Redirect all /shop/* traffic to home until the section goes live.
 * To re-enable: remove or comment out the /shop block below.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/shop')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/shop', '/shop/:path*'],
};
