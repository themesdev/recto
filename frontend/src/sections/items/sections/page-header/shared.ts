import { cn } from '../../../recipes/cn';
import { container } from '../../../recipes/section';
import { headClasses } from '../../../parts/section-head/shared';
import type { PageHeaderVariant } from './types';

/** Classes of the page header, shared by PageHeader.astro and react/PageHeader.tsx. */
export const pageHeaderClasses = (variant: PageHeaderVariant) => {
  const centered = variant === 'centered';
  // The h1 at section-heading size (not the hero's display size): an inner page names itself, it doesn't sell.
  const head = headClasses(centered ? 'center' : 'start', 'section');
  return {
    // Less room than a section. stacked: the hairline closes it and the page's content follows; centered: a band.
    root: centered ? 'py-[calc(var(--space-section)*0.75)]' : 'pt-[calc(var(--space-section)*0.75)]',
    inner: container(),
    // stacked: the hairline under the text spans the content column, not the gutters.
    body: cn('flex flex-col gap-6', centered ? 'items-center text-center' : 'ruled:border-b ruled:pb-[calc(var(--space-section)/2)]'),
    head: cn(head.root, centered && 'mx-auto'),
    eyebrow: head.eyebrow,
    heading: head.heading,
    lead: cn(head.lead, 'max-w-2xl'),
    crumbs: cn('flex flex-wrap items-center gap-x-2 text-muted-foreground', centered && 'justify-center'),
    crumb: 'flex items-center gap-2',
    // The separator: a slash drawn after every crumb but the last, hidden from screen readers.
    sep: 'text-border-strong',
    link: 'inline-flex min-h-11 items-center rounded-sm underline-offset-4 on-hover:text-foreground on-hover:underline',
    current: 'inline-flex min-h-11 items-center font-medium text-foreground',
  };
};
