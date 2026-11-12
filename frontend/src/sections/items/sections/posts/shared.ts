import type { Slot } from '../../../parts/image/responsive';
import { cn } from '../../../recipes/cn';
import { orphanFreeColumns } from '../../../recipes/columns';
import { container, section } from '../../../recipes/section';
import type { PostsVariant } from './types';

/** Classes of the posts section, shared by Posts.astro and react/Posts.tsx. big: the featured variant's first card. */
export const postsClasses = (variant: PostsVariant, count = 6) => {
  const list = variant === 'list';
  return {
    root: section(),
    inner: container('flex flex-col gap-12'),
    top: 'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
    all: 'inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-sm font-medium text-primary-soft-foreground underline-offset-4 on-hover:underline on-press:text-foreground md:self-auto',
    list: list ? 'flex flex-col ruled:divide-y' : cn('grid gap-x-(--space-gap) gap-y-12', variant === 'featured' ? 'sm:grid-cols-2 lg:grid-cols-3' : orphanFreeColumns(count)),
    item: (big: boolean) => cn(list && 'py-8 first:pt-0 last:pb-0', big && 'sm:col-span-2 lg:col-span-3'),
    // The card is the positioning context of the title link's ::before, which covers it: one link per post.
    card: (big: boolean) =>
      cn(
        's-card relative flex flex-col gap-5',
        list && 'md:grid md:grid-cols-3 md:items-start md:gap-(--space-gap)',
        big && 'lg:grid lg:grid-cols-2 lg:items-center lg:gap-(--space-gap)',
      ),
    image: 'aspect-video w-full rounded-card border bg-card object-cover',
    body: cn('flex flex-col gap-3', list && 'md:col-span-2'),
    title: (big: boolean) =>
      cn(
        'font-heading leading-(--text-line-height-heading) font-semibold tracking-(--text-letter-spacing-heading) text-foreground',
        big ? 'text-size-xl lg:text-size-2xl' : 'text-size-lg',
      ),
    // inline-block min-h-6: the link itself measures 24px tall too (2.5.8), not only the card it covers.
    titleLink: 's-press inline-block min-h-6 rounded-sm underline-offset-4 before:absolute before:inset-0 on-hover:underline',
    // Date and tags read after the title (DOM) but sit above it.
    meta: 'order-first flex flex-wrap items-center gap-x-3 gap-y-2 text-size-sm text-muted-foreground',
    tags: 'flex flex-wrap gap-2',
    // A tag is a label, not an action: outlined on foreground, not the accent (accent-overuse).
    tag: 'rounded-sm border px-2 py-0.5 font-medium text-foreground',
    excerpt: (big: boolean) => cn('text-muted-foreground', big && 'text-size-lg'),
    author: 'mt-1 flex items-center gap-3',
    authorName: 'font-medium text-foreground',
  };
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 2026-10-28 → 28 October 2026. By hand rather than Intl, so the server and the browser always write the same text. */
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** A card's address: the post address, a slash, the slug; with trailingSlash a slash after it too (/blog/my-post/),
 *  for sites whose pages end in a slash (Astro's directory output on a static host), so a click isn't redirected. */
export const postHref = (basePath: string, slug: string, trailingSlash = false) => {
  const href = `${basePath.replace(/\/+$/, '')}/${slug}`;
  return trailingSlash && !href.endsWith('/') ? `${href}/` : href;
};

/** The slot a post's image is drawn in (parts/image/responsive SIZES): the featured lead and a pair at half, a lone post
 *  across the container, three-up cards a third (featured: two-up from 640px; the grid: one column until md). */
export const postImageSlot = (variant: PostsVariant | undefined, count: number, big: boolean): Slot =>
  big ? 'half' : variant === 'featured' ? 'third' : variant === 'list' ? 'thirdStacked' : count === 1 ? 'container' : count === 2 ? 'half' : 'thirdStacked';
