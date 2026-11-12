// A code window: a title bar (three quiet dots, the file name, a copy button) over highlighted code that scrolls
// sideways. For code outside an article: the hero's code variant, a docs page's examples. The colours are the code
// tokens of .s-code (site/styles/sections.css), the highlighting parts/rich-text/code.ts (at build time, no script).
import { cn } from '../../recipes/cn';

export const codeWindowClasses = (className?: string) => ({
  root: cn('s-code min-w-0 overflow-hidden rounded-card border bg-card', className),
  bar: 'flex items-center gap-3 border-b py-1 pr-1 pl-4',
  dots: 'flex gap-1.5',
  dot: 'size-2.5 rounded-full border border-border-strong',
  filename: 'min-w-0 flex-1 truncate font-mono text-size-sm text-muted-foreground',
  pre: 'overflow-x-auto p-5 font-mono text-size-sm leading-relaxed text-(--code-foreground) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:p-6',
});
