/**
 * Server-side configuration — mirror of the former FastAPI `config.py`.
 *
 * Reads from server-only environment variables (NOT NEXT_PUBLIC_*), so secrets
 * such as the Razorpay key secret and JWT secret never reach the browser bundle.
 * Defaults match the original Python Settings class exactly, so behaviour is
 * preserved when the variables are unset (local dev).
 */

export interface ServerSettings {
  /* Apify */
  apifyApiToken: string;

  /* Razorpay */
  razorpayKeyId: string;
  razorpayKeySecret: string;

  /* News */
  newsApiKey: string;

  /* App */
  documentaryPriceInr: number;

  /* JWT */
  jwtSecret: string;
  jwtAlgorithm: 'HS256';
  accessTokenExpireMinutes: number;
}

export function getServerSettings(): ServerSettings {
  return {
    apifyApiToken:     process.env.APIFY_API_TOKEN ?? '',
    razorpayKeyId:     process.env.RAZORPAY_KEY_ID ?? '',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? '',
    newsApiKey:        process.env.NEWS_API_KEY ?? '',
    documentaryPriceInr: Number(process.env.DOCUMENTARY_PRICE_INR ?? 299),
    jwtSecret:         process.env.JWT_SECRET ?? 'dev-jwt-secret',
    jwtAlgorithm:      'HS256',
    accessTokenExpireMinutes: Number(process.env.ACCESS_TOKEN_EXPIRE_MINUTES ?? 1440),
  };
}
