import { cn } from '../../../recipes/cn';
import { container, section } from '../../../recipes/section';
import type { TeamVariant } from './types';

/** Classes of the team section, shared by Team.astro and react/Team.tsx. */
export const teamClasses = (variant: TeamVariant) => {
  const grid = variant === 'grid';
  const portraits = variant === 'portraits';
  return {
    root: section(),
    inner: container('flex flex-col gap-16'),
    // portraits: big uncarded portraits, every second column dropped by twice the gap (the list pads its foot so the
    // drop never runs into the next section).
    list: portraits
      ? 'grid grid-cols-2 gap-x-4 gap-y-10 pb-[calc(var(--space-gap)*2)] sm:gap-x-(--space-gap) lg:grid-cols-4'
      : grid ? 'grid grid-cols-2 gap-4 sm:gap-(--space-gap) lg:grid-cols-4' : 'grid gap-x-(--space-gap) sm:grid-cols-2 lg:grid-cols-3',
    // grid: a card per person; list: a row with a hairline above it.
    item: portraits ? 'flex flex-col gap-4 even:translate-y-[calc(var(--space-gap)*2)]' : grid ? 's-glow flex flex-col gap-4 rounded-card border bg-card p-4 sm:gap-5 sm:p-6' : 'flex items-start gap-4 border-t py-6',
    avatar: portraits
      ? 'aspect-3/4 w-full rounded-card bg-primary-soft object-cover'
      : cn('shrink-0 rounded-full bg-primary-soft object-cover', grid ? 'size-16 sm:size-20' : 'size-12'),
    initials: cn(
      'flex shrink-0 items-center justify-center bg-primary-soft font-heading font-semibold text-primary-soft-foreground',
      portraits ? 'aspect-3/4 w-full rounded-card text-size-display' : 'rounded-full',
      portraits ? '' : grid ? 'size-16 text-size-lg sm:size-20 sm:text-size-xl' : 'size-12 text-size-base',
    ),
    body: 'flex min-w-0 flex-col gap-1',
    name: 'font-heading text-size-lg leading-(--text-line-height-heading) font-semibold text-foreground',
    role: 'text-muted-foreground',
    links: cn('flex flex-wrap gap-x-4', grid && 'mt-1'),
    link: 'inline-flex min-h-11 items-center rounded-sm font-medium text-primary-soft-foreground underline-offset-4 on-hover:underline on-press:text-foreground',
    more: 'text-center',
    moreLink: 'inline-flex min-h-11 items-center gap-2 rounded-sm font-medium text-primary-soft-foreground underline-offset-4 on-hover:underline on-press:text-foreground',
  };
};

/** The initials of a person without a photo: parts/avatar's, shared by every attribution. */
export { initials } from '../../../parts/avatar/shared';
