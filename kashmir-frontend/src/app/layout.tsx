import type { Metadata, Viewport } from 'next';
import { Playfair_Display, DM_Sans, Space_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { CONFIG } from '@/lib/config';
import { FILM } from '@/content/film';
import Grain              from '@/components/effects/Grain';
import AtmosphereCanvas   from '@/components/effects/AtmosphereCanvas';
import TemperatureOverlay from '@/components/effects/TemperatureOverlay';
import CursorGlow         from '@/components/effects/CursorGlow';
import SmoothScroll       from '@/components/effects/SmoothScroll';
import Nav from '@/components/layout/Nav';

/* ── Fonts ──────────────────────────────────────── */

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
});

/* ── Metadata ──────────────────────────────────── */

export const metadata: Metadata = {
  title: {
    default: CONFIG.film.title,
    template: `%s · ${CONFIG.film.title}`,
  },
  description: CONFIG.seo.defaultDescription,
  keywords: ['Kashmir', 'documentary', 'conflict', 'peace', 'India', 'Pakistan', 'film', 'Rig 360 Media'],
  authors: [{ name: CONFIG.film.productionCompany }],
  creator: CONFIG.film.productionCompany,
  publisher: CONFIG.film.productionCompany,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: CONFIG.seo.siteUrl,
    siteName: CONFIG.seo.siteName,
    title: CONFIG.film.title,
    description: CONFIG.seo.defaultDescription,
    images: [
      {
        url: CONFIG.seo.ogImage,
        width: 1200,
        height: 630,
        alt: CONFIG.film.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: CONFIG.film.title,
    description: CONFIG.seo.defaultDescription,
    images: [CONFIG.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0C0F',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

/* ── JSON-LD ───────────────────────────────────── */

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Movie',
  name: FILM.title,
  description: FILM.synopsis.long,
  director: {
    '@type': 'Organization',
    name: FILM.productionCompany,
  },
  productionCompany: {
    '@type': 'Organization',
    name: FILM.productionCompany,
  },
  genre: [...FILM.genres],
  duration: `PT${FILM.durationMinutes}M`,
  inLanguage: ['hi', 'en'],
  contentRating: FILM.certificate,
  url: CONFIG.seo.siteUrl,
  image: CONFIG.seo.ogImage,
};

/* ── Root Layout ───────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          {/* Persistent atmospheric effects — z-index: canvas(0) → temp(1) → sections(1,transparent) → nav(100) → grain(9994) → cursor(9995-9999) */}
          <AtmosphereCanvas />
          <TemperatureOverlay />
          <Grain />
          <CursorGlow />

          {/* Navigation */}
          <Nav />

          {/* Page content */}
          <main>
            {children}
          </main>
        </SmoothScroll>

        {/* Razorpay checkout — loaded lazily, only activates when payment flow is triggered */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
