import { cn } from '../../../recipes/cn';
import { action } from '../../../recipes/action';
import { container, section } from '../../../recipes/section';
import { fieldClasses } from '../../../parts/field/shared';
import type { NewsletterVariant } from './types';

/** Classes of the newsletter sign-up, shared by Newsletter.astro and react/Newsletter.tsx. */
export const newsletterClasses = (variant: NewsletterVariant, invalid: boolean) => {
  const card = variant === 'card';
  const band = variant === 'band';
  const f = fieldClasses('email', invalid);
  // inline and band: the heading gets seven of twelve columns (two lines at most), its lead stacked under it; the
  // form takes the end five and sits on the same bottom line as the lead.
  const pair = 'grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-(--space-gap)';
  return {
    root: section(),
    inner: container(card ? 'flex justify-center' : band ? '' : pair),
    // inline: the box steps aside (contents), so the heading and the form are the grid's cells. band: the box is a
    // panel in the accent tone (data-tone on it), the page's one coloured band.
    box: cn(
      card && 'flex w-full max-w-3xl flex-col items-center gap-8 rounded-card border bg-card p-6 text-center sm:p-10 lg:p-12',
      band && cn(pair, 'rounded-card px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16'),
      !card && !band && 'contents',
    ),
    head: cn(!card && 'lg:col-span-7'),
    form: cn('flex w-full flex-col gap-3', card ? 'max-w-xl text-start' : 'lg:col-span-5'),
    label: f.label,
    // The field is capped and the button attached to it from 640px (one control, one line); stacked on phones.
    row: cn('flex w-full flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0', !card && 'max-w-lg'),
    input: cn(f.control, 'sm:flex-1 sm:rounded-e-none'),
    button: cn(action({ emphasis: 'primary' }), 'shrink-0 sm:rounded-s-none'),
    error: f.error,
    note: 'text-size-sm text-muted-foreground',
    // A link in small print is still a 24px target (2.5.8).
    privacy: 's-press inline-flex min-h-6 items-center rounded-sm font-medium text-foreground underline underline-offset-4 on-hover:text-primary-soft-foreground on-hover:decoration-2',
  };
};
