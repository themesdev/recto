// Breadcrumbs (seo-breadcrumbs): where a page sits, as BreadcrumbList JSON-LD and as the visible trail
// (Breadcrumbs.astro, react/Breadcrumbs.tsx), from one list of crumbs. Framework-free.
//   trailFromPath('/journal/grids/', 'Why we draw grids first')   Home › Journal › Why we draw grids first
//   breadcrumbJsonLd(trail, site)                                  positions 1…n, absolute URLs, the last the page
// A theme adds it once to its post, case, release, docs and list layouts; the kit's seo step requires it from depth 2
// (/blog/post/) and recommends it at depth 1 (/pricing/).
import { absoluteUrl, type SiteUrl } from '../seo/json-ld';

export interface Crumb {
  label: string;
  /** Where the crumb goes. A crumb without one is a folder, not a page (Docs › Guides): shown, but left out of the
   *  JSON-LD. The last crumb is the page itself: shown as text, its href (or `page`) named in the JSON-LD. */
  href?: string | null;
}

export interface TrailOptions {
  /** The first crumb's label (default Home; a site's name works too). */
  home?: string | null;
  /** Labels for the sections and folders on the way, by path (/docs/guides/) or segment (journal). A string labels a
   *  page; { label, href: null } a folder. By default the first segment is a page (/journal/ → Journal) and deeper
   *  folders (page/ of /blog/page/2/) are left out. */
  names?: Record<string, string | { label: string; href?: string | null }>;
}

const titleCase = (seg: string) => seg.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());

/** The trail for a page from its path: home, the section (and any folders named in `names`), the page. */
export function trailFromPath(path: string, title: string, { home = 'Home', names = {} }: TrailOptions = {}): Crumb[] {
  const seg = path.split('/').filter(Boolean);
  const trail: Crumb[] = home ? [{ label: home, href: '/' }] : [];
  for (let i = 0; i < seg.length - 1; i++) {
    const prefix = `/${seg.slice(0, i + 1).join('/')}/`;
    const named = names[prefix] ?? names[seg[i]];
    if (named === undefined && i > 0) continue;
    const c = typeof named === 'string' ? { label: named, href: prefix } : named ? { label: named.label, href: named.href === undefined ? prefix : named.href } : { label: titleCase(seg[i]), href: prefix };
    trail.push(c);
  }
  trail.push({ label: title, href: path });
  return trail;
}

/** BreadcrumbList for a trail: positions 1…n, every item an absolute URL, the last the page (its href, or `page`). */
export function breadcrumbJsonLd(trail: Crumb[], site: SiteUrl, page?: string | null) {
  const last = trail.at(-1);
  const pageHref = last?.href ?? page;
  if (!last || !pageHref) throw new Error('breadcrumbJsonLd: the last crumb is the page and needs its href (or pass page)');
  const pages = [...trail.slice(0, -1).filter((c) => c.href), { label: last.label, href: pageHref }];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: pages.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: absoluteUrl(c.href!, site) })),
  };
}
