import { cn } from '../../../recipes/cn';
import { container, section } from '../../../recipes/section';
import type { SplitVariant } from './types';

/** Classes of the split section, shared by Split.astro and react/Split.tsx. */
export const splitClasses = (variant: SplitVariant) => {
  const bleed = variant === 'bleed';
  return {
    // bleed: the screen runs past the container to the window's end edge (the gutter, or the space beside the container
    // when the window is wider); the section clips it, so nothing scrolls sideways.
    root: section(bleed && 'overflow-x-clip'),
    inner: container(bleed ? 'grid items-center gap-12 lg:grid-cols-12 lg:gap-(--space-gap)' : 'grid items-center gap-12 lg:grid-cols-2 lg:gap-16'),
    text: cn('flex flex-col gap-8', bleed && 'lg:col-span-5'),
    points: 'flex flex-col gap-3',
    point: 'flex gap-3 text-foreground',
    check: 'mt-1 shrink-0 text-primary-soft-foreground',
    // image-start: the image is drawn first from 1024px; the DOM (reading and focus order) keeps the text first.
    figure: bleed
      ? 'overflow-hidden rounded-s-card border border-e-0 bg-card -me-6 sm:-me-8 lg:col-span-7 lg:me-[calc(-1*min(max(2rem,(100vw-var(--size-container))/2),(var(--size-bleed-screen)-var(--size-container))/2))] s-bleed-frame'
      : cn('overflow-hidden rounded-card border bg-card', variant === 'image-start' && 'lg:order-first'),
    // bleed: the screen keeps its start edge and top; past the end edge it is the window that stops it.
    image: 'block h-auto w-full',
  };
};
