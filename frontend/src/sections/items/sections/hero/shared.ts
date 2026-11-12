import { cn } from '../../../recipes/cn';
import { container, section } from '../../../recipes/section';
import type { HeroVariant } from './types';

/** Classes of the hero, shared by Hero.astro and react/Hero.tsx. */
export const heroClasses = (variant: HeroVariant) => {
  const split = variant === 'split' || variant === 'code';
  const code = variant === 'code';
  const overlay = variant === 'overlay';
  return {
    // poster: the h1 across the page at up to 1.6× the display size, a rule, then a meta line (the note) at the start and
    // the lead with the buttons offset to the end half. An optional wide image under it all.
    posterInner: container('flex flex-col gap-10 lg:gap-12'),
    posterEyebrow: 'font-mono text-size-sm uppercase tracking-wider text-foreground',
    posterHeading: 's-optical max-w-6xl text-size-display text-foreground md:text-[calc(var(--text-size-display)*1.3)] lg:text-[calc(var(--text-size-display)*1.6)]',
    posterBase: 'grid gap-8 ruled:border-t ruled:border-foreground ruled:pt-6 lg:grid-cols-12 lg:gap-(--space-gap)',
    posterMeta: 'font-mono text-size-sm uppercase tracking-wider text-muted-foreground lg:col-span-5',
    posterText: 'flex flex-col gap-8 lg:col-span-5 lg:col-start-7',
    posterLead: 'max-w-xl text-size-lg text-muted-foreground',
    posterFigure: 'overflow-hidden rounded-card border bg-card',
    // panel: the h1 and its lead side by side (the lead and buttons on the h1's baseline), then the product screen on a
    // band of the accent tone, cut by the band's bottom edge so it reads as a window into the product.
    panelTop: 'grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-(--space-gap)',
    panelHead: 'flex flex-col gap-4 lg:col-span-7',
    panelText: 'flex flex-col gap-8 lg:col-span-4 lg:col-start-9',
    panelLead: 'text-size-lg text-muted-foreground',
    panelCta: 'flex flex-col items-start gap-4',
    panel: 'overflow-hidden rounded-card px-4 pt-6 sm:px-8 sm:pt-10 lg:px-16 lg:pt-16',
    panelFrame: 'aspect-16/9 overflow-hidden rounded-t-card border border-b-0 bg-card sm:aspect-16/8',
    panelImage: 'block size-full object-cover object-top',
    // overlay: a positioning and stacking context for the photo and its scrim, and more room around the text.
    // The root is a stacking context, so the light field (parts/effects, effect.light.opacity) sits behind the art.
    // overlay: at least 9/32 of its width tall (the photo's band never thinner than 32:9, so a wide, short screen still
    // shows most of the picture), up to the cap's height; the text centred in it.
    root: section(
      'relative isolate overflow-hidden',
      overlay && 'flex flex-col justify-center py-[calc(var(--space-section)*1.5)] min-h-[clamp(32rem,calc(100vw*9/32),calc(var(--size-bleed)*9/32))]',
    ),
    inner: container(split ? cn('grid items-center gap-12 lg:gap-(--space-gap)', code ? 'lg:grid-cols-11' : 'lg:grid-cols-2') : 'flex flex-col items-center gap-16'),
    text: cn('flex flex-col gap-8', !split && 'items-center text-center', code && 'min-w-0 lg:col-span-5'),
    // overlay: every text in the tone's foreground (the muted lead and the eyebrow would fall under AA on a photo).
    head: cn(overlay && '*:text-foreground'),
    cta: cn('flex flex-col gap-4', !split && 'items-center'),
    actions: cn(!split && 'justify-center'),
    note: cn('text-size-sm', overlay ? 'text-foreground' : 'text-muted-foreground'),
    figure: cn('overflow-hidden rounded-card border bg-card', !split && 'w-full max-w-5xl'),
    image: 'block h-auto w-full',
    // overlay: the photo fills the section; the scrim is the tone's own ground at 70%, so text contrast holds on any photo.
    // The photo spans the window up to size.bleed, centred; past it the ground shows beside it, edges faded.
    ground: 's-bleed s-bleed-fade absolute inset-y-0 left-1/2 -z-10 h-full w-full -translate-x-1/2 object-cover',
    scrim: 'absolute inset-0 -z-10 bg-background/70',
    // code: the install command (a one-line field with its copy button) and the code window (a title bar with the file
    // name and a copy button, then the highlighted code, scrolling sideways).
    command: 's-code flex max-w-full items-center gap-3 self-start rounded-button border bg-card py-1 pr-1 pl-4 font-mono text-size-sm',
    prompt: 'text-muted-foreground select-none',
    // Below 640px the command wraps (a long package name breaks anywhere) instead of being cut at the field's edge.
    commandText: 'min-w-0 text-foreground max-sm:break-all sm:overflow-x-auto sm:whitespace-nowrap',
    window: 'lg:col-span-6',
  };
};
