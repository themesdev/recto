import { cn } from '../../../recipes/cn';
import { container } from '../../../recipes/section';
import type { HeaderVariant } from './types';

/** Classes of the header, shared by Header.astro and react/Header.tsx. */
export const headerClasses = (variant: HeaderVariant, sticky: boolean) => ({
  root: cn('relative border-b bg-background text-foreground', sticky && 'sticky top-0 z-40'),
  skip: 'sr-only rounded-button bg-background px-4 py-2 focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50',
  bar: container('flex h-16 items-center gap-6'),
  brand: cn(variant === 'centered' && 'lg:flex-1'),
  // One menu for both widths: a panel under the bar below 768px (shown while data-open), the bar's own row from 768px.
  menu: cn(
    'max-lg:absolute max-lg:inset-x-0 max-lg:top-full max-lg:hidden max-lg:flex-col max-lg:gap-4 max-lg:border-b max-lg:bg-background max-lg:px-6 max-lg:pt-2 max-lg:pb-6 max-lg:data-open:flex',
    'lg:contents',
  ),
  nav: cn(variant === 'centered' ? 'lg:mx-auto' : 'lg:ms-2'),
  list: 'flex max-lg:flex-col lg:items-center lg:gap-1',
  link: 's-press flex min-h-11 items-center rounded-button px-3 text-size-base text-muted-foreground on-hover:text-foreground on-press:text-foreground on-press:bg-foreground/5 aria-[current=page]:text-foreground aria-[current=page]:underline aria-[current=page]:underline-offset-8 max-lg:rounded-none max-lg:border-b max-lg:px-0',
  actions: cn('max-lg:flex-col max-lg:items-stretch', variant === 'centered' ? 'lg:flex-1 lg:justify-end' : 'lg:ms-auto'),
  // The light/dark switch sits after the buttons (or after Menu below 768px), a little closer than the bar's gap.
  theme: '-ms-3',
  toggle: 's-press group ms-auto inline-flex min-h-11 items-center gap-2 rounded-button border border-border-strong px-3 text-size-base font-medium on-hover:bg-foreground/5 on-press:bg-foreground/10 aria-expanded:bg-foreground/5 lg:hidden',
});
