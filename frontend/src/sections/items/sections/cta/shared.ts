import { cn } from '../../../recipes/cn';
import { container, section } from '../../../recipes/section';
import type { CtaVariant } from './types';

/** Classes of the call to action, shared by Cta.astro and react/Cta.tsx. */
export const ctaClasses = (variant: CtaVariant) => {
  const split = variant === 'split';
  const row = variant === 'row';
  return {
    // row: half the section rhythm, a band rather than a chapter.
    root: row ? 'py-[calc(var(--space-section)/2)]' : section(),
    inner: container(),
    // panel: its own inverse ground (data-tone="inverse" on this element).
    box: cn(
      'flex flex-col',
      row ? 'gap-6 md:flex-row md:items-center md:justify-between md:gap-(--space-gap)' : 'gap-8',
      split && 'lg:flex-row lg:items-center lg:justify-between lg:gap-(--space-gap)',
      !split && !row && 'items-center text-center',
      variant === 'panel' && 'rounded-card px-6 py-16 sm:px-12',
    ),
    cta: cn('flex flex-col gap-4', split && 'lg:items-end', row && 'gap-3 md:shrink-0 md:items-end', !split && !row && 'items-center'),
    actions: cn('max-sm:w-full max-sm:flex-col max-sm:items-stretch', !split && !row && 'justify-center', row && 'md:flex-nowrap'),
    note: 'text-size-sm text-muted-foreground',
  };
};
