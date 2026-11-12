import { cn } from '../../../recipes/cn';
import { container } from '../../../recipes/section';

export { announcementKey, dismissedKey } from './storage';

/** Classes of the announcement bar, shared by Announcement.astro and react/Announcement.tsx. */
export const announcementClasses = (dismissible: boolean) => ({
  root: 'border-b bg-background text-foreground',
  inner: container('flex min-h-12 items-center gap-2 py-1.5'),
  // With a close button, an empty box of the same width on the start side keeps the text centred (from 640px).
  spacer: cn('size-9 shrink-0 max-sm:hidden', !dismissible && 'hidden'),
  text: 'flex flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-center text-size-base',
  link: 'inline-flex min-h-6 items-center gap-1 rounded-sm font-semibold underline underline-offset-4 on-hover:no-underline',
  close: 's-press inline-flex size-9 shrink-0 items-center justify-center rounded-button text-muted-foreground on-hover:bg-foreground/5 on-hover:text-foreground on-press:bg-foreground/10',
});
