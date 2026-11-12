import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// The token utilities (site/styles/tokens.css › @theme): tailwind-merge must know text-size-display is a size (not a colour)
// and that py-(--space-section) / gap-(--space-gap) are spacing, or it drops classes it thinks conflict.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['size-sm', 'size-base', 'size-lg', 'size-xl', 'size-2xl', 'size-display'],
      radius: ['sm', 'md', 'lg', 'card', 'button'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
