import { cn } from '../../recipes/cn';

/** display: the hero's h1 · section: a section's h2 · compact: a smaller h2 for bands (cta row). */
export type HeadSize = 'display' | 'section' | 'compact';

/** start: flush left · center: centred · split: eyebrow and heading on the left, the lead on the right on its baseline
 *  (from 1024px; stacked below), the editorial head of the board, bento, staggered and track variants. */
export type HeadAlign = 'start' | 'center' | 'split';

export const headClasses = (align: HeadAlign, size: HeadSize) => ({
  // s-reveal: settles in on scroll when a preset turns effect.reveal on (parts/effects).
  root: cn(
    's-reveal',
    align === 'split' ? 'grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-(--space-gap)' : 'flex flex-col',
    align !== 'split' && (size === 'compact' ? 'gap-2' : 'gap-4'),
    align === 'center' && 'mx-auto max-w-3xl items-center text-center',
  ),
  // split: the eyebrow and heading share the left seven columns.
  title: cn('flex flex-col gap-4', align === 'split' && 'lg:col-span-7'),
  eyebrow: 'text-size-sm font-semibold uppercase tracking-wider text-primary-soft-foreground',
  heading: cn(
    size === 'display'
      ? 'text-size-display text-foreground'
      : size === 'compact'
        ? 'font-heading text-size-xl leading-(--text-line-height-heading) font-semibold tracking-(--text-letter-spacing-heading) text-foreground'
        : 'text-size-2xl text-foreground',
    align !== 'center' && size !== 'compact' && 's-optical',
  ),
  lead: cn(size === 'compact' ? 'text-size-base' : 'text-size-lg', 'text-muted-foreground', align === 'center' ? 'max-w-2xl' : 'max-w-xl', align === 'split' && 'lg:col-span-4 lg:col-start-9'),
});
