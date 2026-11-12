import { cn } from '../../../recipes/cn';
import { container } from '../../../recipes/section';
import type { FooterVariant } from './types';

/** A profile link asserts the profile is the site's own (rel=me: Mastodon's verification); a feed is not a profile. */
export const socialRel = (platform: string) => (platform === 'rss' ? undefined : 'me');

/** Classes of the footer, shared by Footer.astro and react/Footer.tsx. */
export const footerClasses = (variant: FooterVariant) => {
  const stacked = variant === 'stacked';
  const fallback = variant === 'columns' || stacked;
  const editorial = variant === 'editorial';
  const product = variant === 'product';
  return {
    // The fallbacks keep their hairline; the others separate by ground and space (pick a tone).
    root: cn(fallback ? 'border-t pt-16 pb-10' : 'pb-10', variant === 'wordmark' && 'overflow-hidden pb-0', editorial ? 'pt-(--space-section)' : !fallback && 'pt-16'),
    inner: container(cn('flex flex-col gap-12', variant === 'wordmark' && '@container')),
    top: stacked
      ? 'flex flex-col items-center gap-8 text-center'
      : editorial
        ? 'grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-(--space-gap)'
        : product
          ? 'grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-(--space-gap)'
          : 'grid gap-12 lg:grid-cols-3 lg:gap-(--space-gap)',
    brand: cn('flex flex-col gap-3', stacked && 'items-center', (editorial || product) && 'lg:col-span-3'),
    tagline: 'max-w-xs text-muted-foreground',
    // Icon links are 44px targets; the list steps back by the padding so the first mark lines up with the text.
    social: cn('flex flex-wrap', stacked ? 'justify-center' : '-ms-3'),
    socialLink: 's-press inline-flex size-11 items-center justify-center rounded-sm text-muted-foreground on-hover:text-foreground',
    groups: cn('grid grid-cols-2 gap-(--space-gap)', editorial ? 'md:col-span-2 lg:col-span-6' : product ? 'sm:grid-cols-3 lg:col-span-5' : 'sm:grid-cols-4 lg:col-span-2'),
    group: 'flex flex-col gap-3',
    groupTitle: 'text-size-sm font-semibold uppercase tracking-wider text-foreground',
    groupList: 'flex flex-col',
    row: 'flex flex-wrap justify-center gap-x-6',
    link: 's-press inline-flex min-h-11 items-center rounded-sm text-muted-foreground on-hover:text-foreground on-press:text-foreground',
    legal: cn('flex flex-col gap-2 text-size-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between', stacked && 'sm:justify-center sm:gap-8', fallback ? 'border-t pt-6' : 'pt-2'),
    legalList: 'flex flex-wrap gap-x-6',
    legalLink: 's-press inline-flex min-h-11 items-center rounded-sm on-hover:text-foreground on-press:text-foreground',
    // cta: the closing band in the accent tone (data-tone on it), the heading on seven columns, the buttons at the end.
    closing: 'grid gap-8 rounded-card px-6 py-10 sm:px-10 lg:grid-cols-12 lg:items-end lg:gap-(--space-gap) lg:px-14 lg:py-14',
    closingText: 'flex flex-col gap-4 lg:col-span-7',
    closingHeading: 'text-size-2xl text-foreground lg:text-size-display',
    closingLead: 'max-w-xl text-size-lg text-muted-foreground',
    closingActions: 'lg:col-span-5 lg:justify-end',
    // editorial: the statement the page ends on.
    statement: 'flex max-w-5xl flex-col gap-4',
    statementText: 's-optical font-heading text-size-display text-foreground',
    // editorial: contact and offices, a column each beside the brand.
    contact: 'flex flex-col gap-3 lg:col-span-3',
    contactTitle: 'text-size-sm font-semibold uppercase tracking-wider text-foreground',
    address: 'flex flex-col gap-1 not-italic text-muted-foreground',
    contactLink: 's-press inline-flex min-h-11 items-center self-start rounded-sm font-medium text-foreground underline-offset-4 on-hover:underline on-press:text-primary-soft-foreground',
    offices: 'flex flex-col gap-3',
    office: 'flex flex-col',
    city: 'font-medium text-foreground',
    hours: 'text-size-sm text-muted-foreground',
    // product: the status line under the brand, the visual at the end.
    status: 's-press inline-flex min-h-11 items-center self-start rounded-sm on-hover:underline on-press:bg-foreground/5',
    visual: 's-depth-1 overflow-hidden rounded-card border bg-card lg:col-span-4',
    visualImage: 'block h-auto w-full',
    // wordmark: the brand name, cut by the page's bottom edge (the root clips it); never wraps, and never wider than the
    // container: --wm-chars (the name's length, set by the component) caps the size at 100cqi over the name at ~0.62em a letter.
    wordmark:
      's-optical select-none whitespace-nowrap font-heading leading-[calc(var(--text-line-height-display)*0.8)] font-(--text-weight-display) tracking-(--text-letter-spacing-display) text-foreground -mb-[calc(var(--text-size-display)*0.5)] text-[min(calc(var(--text-size-display)*2.4),var(--wm-fit))] sm:text-[min(calc(var(--text-size-display)*3.2),var(--wm-fit))] lg:-mb-[calc(var(--text-size-display)*0.65)] lg:text-[min(calc(var(--text-size-display)*4.4),var(--wm-fit))] [--wm-fit:calc(100cqi/(var(--wm-chars,8)*0.62))]',
  };
};
