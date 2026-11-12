import { cn } from './cn';

// Layout shared by every section, as class strings both the Astro and the React components use.

/** The section root: vertical rhythm from space.section. */
export const section = (...extra: (string | false | null | undefined)[]) => cn('py-(--space-section)', ...extra);

/** The content column: size.container wide, with the gutter outside it. */
export const container = (...extra: (string | false | null | undefined)[]) => cn('mx-auto box-content max-w-(--size-container) px-6 sm:px-8', ...extra);
