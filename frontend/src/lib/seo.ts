// Titles, descriptions, canonical links, Open Graph and structured data for every page.
import type { Metadata } from 'next';

/** The address the site lives at (canonical links, sitemap, feed, Open Graph images). Set SITE_URL when you build. */
export const siteUrl = (process.env.SITE_URL || 'https://lowseason.example').replace(/\/+$/, '');

export const absolute = (path: string) => new URL(path, `${siteUrl}/`).href;

/** The Open Graph image of a page: /og/<key>.png (app/og/[...key]/route.tsx). */
export const ogKey = (path: string) => path.replace(/^\/|\/$/g, '') || 'home';

export interface PageMeta {
  /** The page's own title; the site name is added after it (not when `fullTitle`, as on the home page). */
  title: string;
  description?: string | null;
  /** The page's address, with its trailing slash: /about/. */
  path: string;
  siteName: string;
  /** Which Open Graph image: by default the one for this address. */
  og?: string;
  type?: 'website' | 'article';
  published?: string;
  modified?: string;
  noindex?: boolean;
  fullTitle?: boolean;
  /** A markdown version of a long-form page (/blog/<slug>.md), linked as an alternate for answer engines. */
  markdown?: string;
}

export function pageMetadata({ title, description, path, siteName, og, type = 'website', published, modified, noindex = false, fullTitle = false, markdown }: PageMeta): Metadata {
  const image = absolute(`/og/${og ?? ogKey(path)}.png`);
  return {
    title: { absolute: fullTitle ? title : `${title} · ${siteName}` },
    description: description ?? undefined,
    alternates: { canonical: absolute(path), types: { 'application/rss+xml': [{ url: absolute('/rss.xml'), title: `${siteName} blog` }], ...(markdown ? { 'text/markdown': absolute(markdown) } : {}) } },
    robots: noindex ? { index: false } : undefined,
    openGraph: {
      type,
      siteName,
      title,
      description: description ?? undefined,
      url: absolute(path),
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle ? title : `${title} · ${siteName}` }],
      locale: 'en_GB',
      ...(type === 'article' ? { publishedTime: published, modifiedTime: modified } : {}),
    },
    twitter: { card: 'summary_large_image' },
  };
}

/** schema.org Organization and WebSite, for the home page. */
export function siteJsonLd(site: { name: string; tagline: string; organisation?: { legalName?: string | null; email?: string | null } | null }) {
  const origin = absolute('/');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${origin}#organisation`, name: site.name, legalName: site.organisation?.legalName ?? undefined, url: origin, logo: absolute('/favicon.svg'), email: site.organisation?.email ?? undefined },
      { '@type': 'WebSite', '@id': `${origin}#website`, url: origin, name: site.name, description: site.tagline, publisher: { '@id': `${origin}#organisation` } },
    ],
  };
}

/** BreadcrumbList for a nested page: Home, its section, the page (folders under a section, like page/, are not pages). */
export function breadcrumbJsonLd(path: string, title: string) {
  const NAMES: Record<string, string> = { blog: 'Essays' };
  const seg = path.split('/').filter(Boolean);
  if (seg.length < 2) return null;
  const trail = [
    { name: 'Home', href: '/' },
    { name: NAMES[seg[0]] ?? seg[0].replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()), href: `/${seg[0]}/` },
    { name: title, href: path },
  ];
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: absolute(t.href) })) };
}
