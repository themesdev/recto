// Links to the other pages of a long list (the posts section's pages). Framework-free: Pagination.astro and
// react/Pagination.tsx draw the same DOM from these. The page that renders the list knows where it is and passes it in:
// a static site builds /blog, /blog/page/2 … (Astro's paginate()), a Next.js app reads ?page= or a route segment.
import { cn } from '../../recipes/cn';

export interface PaginationInfo {
  /** The page shown, from 1. */
  page: number;
  /** How many pages there are. */
  pages: number;
  /** The address of page n, with {page} where the number goes: /blog/page/{page}. */
  href: string;
  /** The address of page 1 when it differs (/blog rather than /blog/page/1). */
  firstHref?: string | null;
}

/** The address of page n. */
export const pageHref = (p: PaginationInfo, n: number) => (n === 1 && p.firstHref ? p.firstHref : p.href.replace('{page}', String(n)));

/** The page numbers to show: the first, the last, and the pages around the current one; 'gap' where some are left out. */
export function pageItems(page: number, pages: number): (number | 'gap')[] {
  const keep = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
  const out: (number | 'gap')[] = [];
  let last = 0;
  for (const n of [...keep].sort((a, b) => a - b)) {
    if (n - last === 2) out.push(n - 1);
    else if (n - last > 2) out.push('gap');
    out.push(n);
    last = n;
  }
  return out;
}

export const paginationClasses = {
  root: 'flex justify-center',
  list: 'flex flex-wrap items-center justify-center gap-1',
  // Below 640px previous and next keep their names for screen readers but show only the arrow, so the row fits.
  stepLabel: 'max-sm:sr-only',
  step: 's-press inline-flex min-h-11 min-w-11 justify-center items-center gap-2 rounded-button px-3 font-medium text-foreground on-hover:bg-foreground/5 on-press:bg-foreground/10',
  stepOff: 'inline-flex min-h-11 min-w-11 justify-center items-center gap-2 px-3 text-muted-foreground',
  number: (current: boolean) =>
    cn('s-press inline-flex size-11 items-center justify-center rounded-button font-medium tabular-nums', current ? 'bg-primary text-primary-foreground on-hover:bg-[color-mix(in_oklch,var(--primary),var(--foreground)_var(--state-hover-mix))]' : 'text-foreground on-hover:bg-foreground/5 on-press:bg-foreground/10'),
  gap: 'inline-flex size-11 items-center justify-center text-muted-foreground',
  prevIcon: 'rotate-180',
};
