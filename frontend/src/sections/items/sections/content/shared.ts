import { cn } from '../../../recipes/cn';
import { orphanFreeColumns } from '../../../recipes/columns';
import { container, section } from '../../../recipes/section';
import type { ContentVariant } from './types';

/** Classes of the content section, shared by Content.astro and react/Content.tsx. The reading column is max-w-prose
 *  (65ch); paragraphs and subheadings keep one rhythm: gap-4 inside a block, gap-10 between blocks. */
export const contentClasses = (variant: ContentVariant, blocks = 1) => {
  const split = variant === 'split';
  const statement = variant === 'statement';
  return {
    root: section(),
    inner: container(split ? 'grid gap-12 lg:grid-cols-5 lg:gap-(--space-gap)' : statement ? 'flex flex-col gap-14 lg:gap-20' : 'flex flex-col items-center gap-12'),
    // statement: the heading at the display size across most of the page, the lead under it at the end half; the blocks
    // as short columns under a rule. An editorial moment between denser sections, best on the accent or inverse tone.
    head: cn(split ? 'lg:sticky lg:top-24 lg:col-span-2 lg:self-start' : statement ? 'max-w-5xl' : 'w-full max-w-prose'),
    prose: cn(
      'flex flex-col gap-10',
      split ? 'max-w-prose lg:col-span-3' : statement ? cn('grid gap-10 md:gap-(--space-gap) ruled:border-t ruled:pt-8', orphanFreeColumns(blocks)) : 'w-full max-w-prose',
    ),
    block: cn('flex flex-col', statement ? 'gap-3' : 'gap-4'),
    subheading: 'font-heading text-size-xl leading-(--text-line-height-heading) font-semibold tracking-(--text-letter-spacing-heading) text-foreground',
    paragraph: statement ? 'text-muted-foreground' : 'text-size-lg text-muted-foreground',
    blockHeading: 'font-heading text-size-lg leading-(--text-line-height-heading) font-semibold text-foreground',
  };
};
