// /sitemap.xml: every page and post (not the thank-you page or the 404).
import type { MetadataRoute } from 'next';
import { pageCount } from '../components/BlogIndex';
import { getPostCount, getPostSlugs } from '../lib/content';
import { absolute } from '../lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, count] = await Promise.all([getPostSlugs(), getPostCount()]);
  const pages = ['/', '/about/', '/blog/', '/privacy/'];
  const blogPages = Array.from({ length: pageCount(count) - 1 }, (_, i) => `/blog/page/${i + 2}/`);
  return [...pages, ...blogPages].map((p) => ({ url: absolute(p) })).concat(posts.map((p) => ({ url: absolute(`/blog/${p.slug}/`), lastModified: p.date })));
}
