// Structured data (schema.org JSON-LD) per page kind, framework-free, so the Astro and the Next edition of a theme
// write the same blocks. Each helper returns a plain object; jsonLd() turns it into the text of a
// <script type="application/ld+json"> (or use JsonLd.astro / react/JsonLd.tsx, which do both).
//   siteJsonLd       home: Organization + WebSite (one @id each, so other blocks can point at the organisation)
//   articleJsonLd    post (BlogPosting), docs and release (TechArticle), or any Article
//   caseJsonLd       case study (CreativeWork)
// The section helpers live beside their section: faqJsonLd (faq), pricingJsonLd (pricing), servicesJsonLd
// (services); breadcrumbJsonLd in parts/breadcrumbs. The QA seo step checks what each kind needs
// and that the content matches the page, so feed them the values the page shows.

/** Where the site lives: its origin (https://corvel.example), as a string or a URL (Astro.site). */
export type SiteUrl = string | URL;

/** An absolute URL for a path on the site. */
export const absoluteUrl = (path: string, site: SiteUrl) => new URL(path, String(site).replace(/\/*$/, '/')).href;

/** The text of a JSON-LD script: "<" is escaped, so a value can't close the script element. */
export const jsonLd = (data: object | string) => (typeof data === 'string' ? data : JSON.stringify(data)).replace(/</g, '\\u003c');

/** The @id of the site's Organization (siteJsonLd), for publisher, provider and creator references. */
export const organizationId = (site: SiteUrl) => `${absoluteUrl('/', site)}#organisation`;

const CONTEXT = 'https://schema.org';
type Json = Record<string, unknown>;

/** Leaves out undefined, null, '' and empty arrays, so a missing field is absent rather than empty. */
export function compact<T extends Json>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length))) as T;
}

/** ISO 8601 for a date: a Date, or a string kept as written when it already is ISO (2026, 2026-11, 2026-11-05…). */
export function isoDate(d: Date | string | null | undefined): string | undefined {
  if (!d) return undefined;
  if (d instanceof Date) return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  if (/^\d{4}(-\d{2}(-\d{2}(T[\d:.]+(Z|[+-]\d{2}:?\d{2})?)?)?)?$/.test(d)) return d;
  const parsed = new Date(d);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/** The organisation as a reference node, with its name and address so a reader of one block alone still has both. */
export const organizationRef = (site: SiteUrl, name: string) => ({ '@type': 'Organization', '@id': organizationId(site), name, url: absoluteUrl('/', site) });

export interface SiteInfo {
  name: string;
  site: SiteUrl;
  /** The tagline or the home page's description. */
  description?: string | null;
  /** The logo, a path or URL (default /favicon.svg). */
  logo?: string | null;
  legalName?: string | null;
  email?: string | null;
  /** The organisation's own profiles elsewhere (social links). */
  sameAs?: string[] | null;
}

/** Home: the Organization and the WebSite it publishes. */
export function siteJsonLd({ name, site, description, logo = '/favicon.svg', legalName, email, sameAs }: SiteInfo) {
  const origin = absoluteUrl('/', site);
  return {
    '@context': CONTEXT,
    '@graph': [
      compact({ '@type': 'Organization', '@id': organizationId(site), name, legalName, url: origin, logo: logo ? absoluteUrl(logo, site) : undefined, email, sameAs }),
      compact({ '@type': 'WebSite', '@id': `${origin}#website`, url: origin, name, description, publisher: { '@id': organizationId(site) } }),
    ],
  };
}

export interface Author {
  name: string;
  /** Job title (Design lead). */
  role?: string | null;
  /** A page about the person. */
  url?: string | null;
}

export interface ArticleInfo {
  /** BlogPosting for a post, TechArticle for docs and releases, Article otherwise. */
  type?: 'BlogPosting' | 'TechArticle' | 'Article' | 'NewsArticle';
  /** The page's h1 (the kit warns when it differs). */
  headline: string;
  description?: string | null;
  /** The page's path (/journal/slug/). */
  path: string;
  site: SiteUrl;
  /** The cover or the page's social card, a path or URL. */
  image?: string | null;
  datePublished?: Date | string | null;
  dateModified?: Date | string | null;
  author?: Author | string | null;
  /** The site's name, for the publisher (the Organization of siteJsonLd). */
  publisher?: string | null;
  keywords?: string[] | null;
}

/** A post, docs page or release. A post needs author, datePublished and image; a release datePublished. */
export function articleJsonLd({ type = 'BlogPosting', headline, description, path, site, image, datePublished, dateModified, author, publisher, keywords }: ArticleInfo) {
  const url = absoluteUrl(path, site);
  const person = typeof author === 'string' ? { name: author } : author;
  return compact({
    '@context': CONTEXT,
    '@type': type,
    headline,
    description,
    url,
    mainEntityOfPage: url,
    image: image ? absoluteUrl(image, site) : undefined,
    datePublished: isoDate(datePublished),
    dateModified: isoDate(dateModified ?? datePublished),
    author: person ? compact({ '@type': 'Person', name: person.name, jobTitle: person.role, url: person.url ? absoluteUrl(person.url, site) : undefined }) : undefined,
    publisher: publisher ? organizationRef(site, publisher) : undefined,
    keywords: keywords?.length ? keywords.join(', ') : undefined,
  });
}

export interface CaseInfo {
  /** The case's title (or the client and a few words). */
  name: string;
  description?: string | null;
  path: string;
  site: SiteUrl;
  image?: string | null;
  /** When the work was made: a year (2025) or a date. */
  date?: Date | string | null;
  /** The client, as the source organisation. */
  client?: string | null;
  /** The studio that made it (the site's name). */
  creator?: string | null;
  keywords?: string[] | null;
}

/** A case study: the work as a CreativeWork by the studio for the client. */
export function caseJsonLd({ name, description, path, site, image, date, client, creator, keywords }: CaseInfo) {
  const url = absoluteUrl(path, site);
  return compact({
    '@context': CONTEXT,
    '@type': 'CreativeWork',
    name,
    headline: name,
    description,
    url,
    mainEntityOfPage: url,
    image: image ? absoluteUrl(image, site) : undefined,
    dateCreated: isoDate(typeof date === 'number' ? String(date) : date),
    creator: creator ? organizationRef(site, creator) : undefined,
    sourceOrganization: client ? { '@type': 'Organization', name: client } : undefined,
    keywords: keywords?.length ? keywords.join(', ') : undefined,
  });
}
