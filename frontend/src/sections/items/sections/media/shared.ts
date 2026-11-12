import { container, section } from '../../../recipes/section';
import { headingId } from '../../../parts/section-head/id';
import type { MediaVariant } from './types';

/** Classes of the media section, shared by Media.astro and react/Media.tsx. */
export const mediaClasses = (variant: MediaVariant) => ({
  root: section(),
  inner: container('flex flex-col gap-12'),
  // annotated: the screen in eight columns with numbered markers on it, the callouts as a numbered list beside it
  // (below it under 1024px). The markers are drawn, the list is what a screen reader reads.
  body: variant === 'annotated' ? 'grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-(--space-gap)' : 'contents',
  annotatedFigure: 'flex flex-col gap-4 lg:col-span-8',
  annotatedFrame: 'relative overflow-hidden rounded-card border bg-card',
  // markers: letters (default) or numbers in a tile, or dots alone. The list beside the screen draws the same mark.
  marker: (dots: boolean) =>
    dots
      ? 'absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/25'
      : 'absolute flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary font-heading text-size-sm font-semibold text-primary-foreground tabular-nums ring-4 ring-background',
  callouts: 'flex flex-col lg:col-span-4 ruled:divide-y ruled:border-y',
  callout: 'flex gap-4 py-5',
  number: (dots: boolean) =>
    dots
      ? 'mt-2 size-2.5 shrink-0 rounded-full bg-primary'
      : 'flex size-7 shrink-0 items-center justify-center rounded-full border border-border-strong font-heading text-size-sm font-semibold text-foreground tabular-nums',
  calloutBody: 'flex flex-col gap-1',
  calloutTitle: 'font-heading text-size-lg leading-(--text-line-height-heading) font-semibold text-foreground',
  calloutText: 'text-muted-foreground',
  figure: 'flex flex-col gap-4',
  frame: 'overflow-hidden rounded-card border bg-card',
  media: 'block h-auto w-full',
  // The video's own controls take focus inside it (a shadow root): draw the ring on the video while they have it.
  video: 'block h-auto w-full focus:outline-2 focus:outline-offset-2 focus:outline-ring',
  caption: 'mx-auto max-w-2xl text-center text-muted-foreground',
});

/** The caption's id: the section is labelled by it when it has no heading. */
export const captionId = (caption: string, id?: string | null) => headingId(caption, id).replace(/-title$/, '-caption');

/** annotated: the mark of callout i: A, B, C (letters), 1, 2, 3 (numbers), none for dots. */
export const markLabel = (markers: 'letters' | 'numbers' | 'dots', i: number) => (markers === 'numbers' ? String(i + 1) : markers === 'letters' ? String.fromCharCode(65 + i) : '');

/** annotated: a marker's place on the screen, in percent of its width and height, kept inside the frame. */
export const markerStyle = (x: number, y: number) => ({ left: `${Math.min(Math.max(x, 4), 96)}%`, top: `${Math.min(Math.max(y, 4), 96)}%` });
