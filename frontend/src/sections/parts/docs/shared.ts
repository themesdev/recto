// The docs shell: what DocsShell, DocsSidebar, DocsToc, DocsPager, Breadcrumbs, DocsSearch and EndpointList share in
// Astro and React (classes, the search, the table of contents' current heading). Framework-free.
//
//   DocsShell     the three columns: the sidebar (a disclosure on phones), the page, On this page (from 1280px)
//   DocsSidebar   grouped links, the current page marked (aria-current=page)
//   DocsToc       On this page: the page's h2 and h3, the heading in view marked (data-active) as you scroll
//   DocsPager     previous and next page
//   Breadcrumbs   where the page sits: Docs › Guides › Retries
//   DocsSearch    a button (and / or Ctrl/⌘K) opening a dialog that searches a JSON index of the docs, in the browser
//   EndpointList  an API page's endpoints (method and path), each linking to its heading
import { cn } from '../../recipes/cn';
import type { Link } from '../kinds';

export interface DocsGroup {
  title: string;
  links: Link[];
}
export interface DocsHeading {
  depth: 2 | 3;
  text: string;
  id: string;
}
export interface DocsEndpoint {
  method: string;
  path: string;
  /** The endpoint's heading on the page (its id is the link target). */
  title: string;
  id: string;
}
/** One page in the search index (a JSON array at the address DocsSearch gets). */
export interface DocsSearchEntry {
  title: string;
  href: string;
  /** The sidebar group: Guides. */
  group?: string;
  /** The page's h2 and h3, so a search can land on a heading. */
  headings?: { text: string; id: string }[];
  /** The page's text, plain, for matches in the body. */
  text?: string;
}
export interface DocsSearchResult {
  title: string;
  href: string;
  context: string;
}

/** Is this link the page at path (trailing slashes ignored)? */
export const isCurrent = (href: string, path?: string | null) => !!path && href.replace(/\/+$/, '') === path.replace(/\/+$/, '');

export const docsShellClasses = {
  root: 'mx-auto box-content max-w-(--size-container) px-6 sm:px-8 lg:grid lg:grid-cols-12 lg:gap-x-(--space-gap)',
  // Phones and tablets: the sidebar in a disclosure above the page.
  mobile: 'group border-b lg:hidden',
  summary:
    's-docs-summary flex min-h-12 cursor-pointer list-none items-center gap-2 text-size-sm font-medium text-foreground',
  summaryIcon: 'text-muted-foreground transition-transform group-open:rotate-180',
  mobileNav: 'pb-6',
  // From 1024px: the sidebar beside the page, sticking below the site header (s-docs-aside: --docs-offset).
  aside: 's-docs-aside hidden border-r py-10 pr-6 lg:col-span-3 lg:block',
  main: 'min-w-0 py-10 lg:col-span-9 lg:py-12 xl:col-span-7',
  toc: 's-docs-aside hidden py-12 xl:col-span-2 xl:block',
};

export const docsSidebarClasses = (className?: string) => ({
  nav: cn('flex flex-col gap-8 text-size-sm', className),
  group: 'flex flex-col gap-2',
  title: 'px-3 font-mono font-medium text-muted-foreground',
  list: 'flex flex-col gap-0.5',
  link: 'flex min-h-9 items-center rounded-button px-3 text-foreground on-hover:bg-card data-current:bg-primary-soft data-current:font-medium data-current:text-primary-soft-foreground',
});

export const docsTocClasses = (className?: string) => ({
  nav: cn('flex flex-col gap-3 text-size-sm', className),
  title: 'font-medium text-foreground',
  list: 'flex flex-col border-l',
  link: (depth: 2 | 3) =>
    cn(
      '-ml-px flex min-h-8 items-center border-l-2 border-transparent py-1 text-muted-foreground on-hover:text-foreground data-active:border-primary data-active:text-foreground',
      depth === 3 ? 'pl-6' : 'pl-3',
    ),
});

export const docsPagerClasses = (className?: string) => ({
  nav: cn('mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2', className),
  link: (next: boolean) =>
    cn('s-card flex flex-col gap-1 rounded-card border p-5 on-hover:border-border-strong', next && 'items-end text-right sm:col-start-2'),
  label: 'inline-flex items-center gap-1 text-size-sm text-muted-foreground',
  title: 'font-medium text-foreground',
});

// Breadcrumbs moved to parts/breadcrumbs (the trail and its BreadcrumbList JSON-LD); its classes stay importable here.
export { breadcrumbsClasses } from '../breadcrumbs/shared';

export const docsSearchClasses = (className?: string) => ({
  root: cn('relative', className),
  button:
    's-press flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-button border bg-background px-3 text-size-sm text-muted-foreground on-hover:border-border-strong on-press:bg-card',
  buttonLabel: 'min-w-0 flex-1 truncate text-left',
  // The shortcut only where there is likely a keyboard (from 640px).
  kbd: 'hidden rounded-sm border px-1.5 font-mono text-size-sm text-muted-foreground sm:inline',
  dialog:
    'mx-auto mt-24 w-full max-w-xl overflow-hidden rounded-card border bg-background p-0 text-foreground backdrop:bg-foreground/40 max-sm:mt-4 max-sm:max-w-none',
  field: 'flex items-center gap-3 px-4 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-ring',
  input: 'min-h-14 w-full bg-transparent text-size-base text-foreground placeholder:text-muted-foreground focus:outline-none',
  close: 's-press inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-button text-muted-foreground on-hover:text-foreground',
  status: 'border-t px-4 py-2 text-size-sm text-muted-foreground',
  results: 'max-h-96 overflow-y-auto px-2 pb-2',
  result:
    'flex flex-col gap-0.5 rounded-button px-3 py-2 on-hover:bg-card focus-visible:bg-card focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
  resultTitle: 'font-medium text-foreground',
  resultContext: 'line-clamp-2 text-size-sm text-muted-foreground',
});

export const endpointListClasses = (className?: string) => ({
  list: cn('flex flex-col divide-y rounded-card border', className),
  link: 'flex min-h-11 items-center gap-3 px-4 py-2 font-mono text-size-sm text-foreground on-hover:bg-card',
  method: (method: string) =>
    cn(
      'w-16 shrink-0 rounded-sm border py-0.5 text-center font-semibold',
      // A method is a label, not an action: foreground, not the accent (accent-overuse); delete in the destructive colour.
      method === 'get' ? 'border-border-strong text-foreground' : method === 'delete' ? 'border-destructive text-destructive' : method === 'post' ? 'border-transparent bg-foreground text-background' : 'text-foreground',
    ),
  path: 'min-w-0 flex-1 truncate',
  title: 'hidden font-sans text-muted-foreground sm:block',
});

/** The search's words. */
export const DOCS_SEARCH = {
  label: 'Search docs',
  dialog: 'Search the docs',
  placeholder: 'Search the docs',
  close: 'Close search',
  none: (q: string) => `Nothing found for “${q}”`,
  count: (n: number) => (n === 1 ? '1 result' : `${n} results`),
  loading: 'Loading the index…',
  failed: 'The search index could not be loaded.',
};

const words = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean);
const hasAll = (text: string, ws: string[]) => ws.every((w) => text.includes(w));

/** Searches the index for every word of the query: titles first, then headings (linking to the heading), then the
 *  text (with a few words around the first match). */
export function searchDocs(index: DocsSearchEntry[], query: string, limit = 8): DocsSearchResult[] {
  const ws = words(query);
  if (!ws.length) return [];
  const scored: (DocsSearchResult & { score: number })[] = [];
  for (const e of index) {
    const title = e.title.toLowerCase();
    if (hasAll(title, ws)) scored.push({ title: e.title, href: e.href, context: e.group ?? '', score: title.startsWith(ws[0]) ? 110 : 100 });
    for (const h of e.headings ?? [])
      if (hasAll(h.text.toLowerCase(), ws)) scored.push({ title: h.text, href: `${e.href}#${h.id}`, context: `${e.title}${e.group ? ` · ${e.group}` : ''}`, score: 60 });
    const text = e.text ?? '';
    const lower = text.toLowerCase();
    if (!hasAll(title, ws) && hasAll(lower, ws)) {
      const at = lower.indexOf(ws[0]);
      const start = Math.max(0, text.lastIndexOf(' ', Math.max(0, at - 40)) + 1);
      const snippet = text.slice(start, start + 140).trim();
      scored.push({ title: e.title, href: e.href, context: `${start > 0 ? '…' : ''}${snippet}…`, score: 30 });
    }
  }
  const seen = new Set<string>();
  return scored
    .sort((a, b) => b.score - a.score)
    .filter((r) => (seen.has(r.href) ? false : (seen.add(r.href), true)))
    .slice(0, limit)
    .map(({ title, href, context }) => ({ title, href, context }));
}

/** On this page: marks the link of the last heading above the top third of the window (data-active) while scrolling.
 *  Returns a function that stops it. */
export function watchToc(nav: Element) {
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const targets = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
  let frame = 0;
  const update = () => {
    frame = 0;
    let current = -1;
    targets.forEach((t, i) => {
      if (t && t.getBoundingClientRect().top < innerHeight / 3) current = i;
    });
    links.forEach((a, i) => a.toggleAttribute('data-active', i === current));
  };
  const onScroll = () => (frame ||= requestAnimationFrame(update));
  addEventListener('scroll', onScroll, { passive: true });
  update();
  return () => removeEventListener('scroll', onScroll);
}

/** Opens the search on / (outside a field) and on Ctrl/⌘K. Returns a function that stops listening. */
export function searchShortcut(open: () => void) {
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    const typing = !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey)) {
      e.preventDefault();
      open();
    }
  };
  addEventListener('keydown', onKey);
  return () => removeEventListener('keydown', onKey);
}

/** Arrow keys in the search dialog: down from the field to the first result, up and down between results, up from
 *  the first result back to the field. */
export function searchArrows(e: KeyboardEvent, dialog: HTMLElement) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const input = dialog.querySelector<HTMLInputElement>('input');
  const items = [...dialog.querySelectorAll<HTMLAnchorElement>('[data-search-result]')];
  const at = items.indexOf(document.activeElement as HTMLAnchorElement);
  const next = e.key === 'ArrowDown' ? (at < 0 ? 0 : Math.min(at + 1, items.length - 1)) : at - 1;
  e.preventDefault();
  (next < 0 ? input : items[next])?.focus();
}
