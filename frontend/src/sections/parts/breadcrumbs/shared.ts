// Classes of the visible trail, shared by Breadcrumbs.astro and react/Breadcrumbs.tsx (and parts/docs, which uses them).
import { cn } from '../../recipes/cn';

export const breadcrumbsClasses = (className?: string) => ({
  nav: cn('text-size-sm text-muted-foreground', className),
  list: 'flex flex-wrap items-center gap-x-2 gap-y-1',
  item: 'inline-flex items-center gap-2',
  link: 'inline-flex min-h-6 items-center rounded-sm underline-offset-4 on-hover:text-foreground on-hover:underline',
  current: 'text-foreground',
});
