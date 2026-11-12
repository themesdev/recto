// Effect primitives (site/styles/sections.css › Effects; tokens effect.*): CSS first, the same markup in Astro and
// React, each one complete under prefers-reduced-motion and none of them moving the layout. All are off in the default
// tokens; a preset turns on what fits its style (README › Effects, docs/COMPOSITIONS.md › Effects).
import type { CSSProperties } from 'react';
import { cn } from '../../recipes/cn';

export type TextureKind = 'grain' | 'grid';
export const textureClass = (kind: TextureKind, className?: string) => cn('s-texture', kind === 'grid' ? 's-texture-grid' : 's-texture-grain', className);

/** Typing: one line's style (its turn and its length, for the clip's steps). */
export const typeLineStyle = (i: number, line: string) => ({ '--i': String(i), '--chars': String(Math.max(1, line.length)) }) as CSSProperties;

/** Ticker: the keyframes for its count (2, 3 or 4 values) and each value's turn. */
export const tickStyle = (n: number) => {
  const count = Math.min(Math.max(n, 2), 4);
  return { '--n': String(count), '--tick': `s-tick-${count}` } as CSSProperties;
};
export const tickValueStyle = (i: number) => ({ '--i': String(i) }) as CSSProperties;

/** Status pulse: live and down pulse; idle is a still dot. */
export type Status = 'live' | 'idle' | 'down';
export const statusClasses = (status: Status) => ({
  root: 'inline-flex items-center gap-2 text-size-sm font-medium text-foreground',
  dot: cn('s-pulse shrink-0', status === 'live' ? 'text-primary-soft-foreground' : status === 'down' ? 'text-destructive' : 'text-muted-foreground'),
});

/** Marquee: a row of short items that moves slowly; the pause button stops it (WCAG 2.2.2), hover and focus too. */
export const marqueeClasses = {
  root: 'flex flex-col gap-3',
  head: 'flex justify-end',
  pause:
    's-press group inline-flex size-11 items-center justify-center rounded-button text-muted-foreground on-hover:text-foreground on-press:bg-foreground/10 motion-reduce:hidden',
  pauseIcon: 'group-aria-pressed:hidden',
  playIcon: 'hidden group-aria-pressed:block',
  list: 'flex shrink-0 items-center gap-x-12 pe-12 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:pe-0',
  clone: 'motion-reduce:hidden',
  item: 'whitespace-nowrap font-heading text-size-xl text-muted-foreground',
};
/** One lap takes 4 seconds per item, so a longer row does not run faster. */
export const marqueeStyle = (count: number) => ({ '--marquee-duration': `${Math.max(16, count * 4)}s` }) as CSSProperties;

/** The showcase turns every effect on (a preset sets these in its tokens instead). */
export const SHOWCASE_TOKENS = {
  '--effect-reveal-fade': '1',
  '--effect-reveal-distance': '16px',
  '--effect-glow-strength': '18%',
  '--effect-light-opacity': '0.5',
  '--effect-overlap': '48px',
} as CSSProperties;
export const GRAIN_ON = { '--effect-texture-opacity': '0.07' } as CSSProperties;
export const GRID_ON = { '--effect-texture-opacity': '0.45' } as CSSProperties;

export const showcaseClasses = {
  inner: 'flex flex-col gap-16',
  head: 'flex max-w-2xl flex-col gap-3',
  heading: 'text-size-2xl text-foreground',
  lead: 'text-size-lg text-muted-foreground',
  label: 'font-mono text-size-sm uppercase tracking-wider text-muted-foreground',
  hero: 'relative isolate grid gap-10 overflow-hidden rounded-card border bg-background p-6 sm:p-10 lg:grid-cols-2 lg:items-center',
  heroText: 'relative z-10 flex flex-col gap-5',
  heroTitle: 'font-heading text-size-xl font-semibold text-foreground',
  statuses: 'flex flex-col gap-2',
  metric: 'text-size-lg text-foreground',
  code: 's-code s-depth-2 relative z-10 overflow-hidden rounded-card border bg-card p-5 font-mono text-size-sm text-foreground',
  cards: 'grid gap-(--space-gap) md:grid-cols-3',
  card: 's-glow s-depth-1 flex flex-col gap-2 rounded-card border bg-card p-6',
  cardTitle: 'font-heading text-size-lg font-semibold text-foreground',
  cardText: 'text-muted-foreground',
  band: 'relative isolate overflow-hidden rounded-card border bg-background px-6 py-16 text-center sm:px-10',
  bandText: 'relative z-10 mx-auto max-w-xl font-heading text-size-xl font-semibold text-foreground',
  reveals: 'grid gap-(--space-gap) md:grid-cols-3',
  reveal: 's-reveal flex flex-col gap-2 rounded-card bg-card p-6',
  overlapTop: 's-overlap s-depth-2 mx-auto flex max-w-2xl flex-col gap-2 rounded-card border bg-card p-6',
  // Inside a section the band makes room with the gap, not a section's padding (s-after-overlap is for section roots).
  overlapBottom: 'rounded-card px-6 pt-[calc(var(--effect-overlap)+var(--space-gap))] pb-8 text-center sm:px-10',
  overlapText: 'mx-auto max-w-xl font-heading text-size-xl font-semibold text-foreground',
};
