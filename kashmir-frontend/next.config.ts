import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85, 88, 90],
  },

  /* Backend now lives in same-origin Next.js API routes under src/app/api.
     No proxy/rewrite needed — there is no separate backend server. */
};

export default nextConfig;
