import type { MetadataRoute } from 'next';
import { CONFIG } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = CONFIG.seo.siteUrl;

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
