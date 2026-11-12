// /robots.txt: everything but the API routes, and where the sitemap is.
import type { MetadataRoute } from 'next';
import { absolute } from '../lib/seo';

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }], sitemap: absolute('/sitemap.xml') };
}
