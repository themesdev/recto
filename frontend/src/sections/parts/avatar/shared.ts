import { cn } from '../../recipes/cn';

// The visual of every attribution (a quote's person, a team member, a post's author): the photo when there is one,
// else a monogram tile with the initials. An attribution never shows a name with an empty space or nothing beside it.

/** sm: a byline (32px) · md: a quote's caption (48px) · lg: a large quote or a list row (56px). */
export type AvatarSize = 'sm' | 'md' | 'lg';
/** circle: the photo's round crop, and a round tile · tile: a rounded square, for editorial quotes. */
export type AvatarShape = 'circle' | 'tile';

const SIZES = { sm: 'size-8 text-size-sm', md: 'size-12 text-size-base', lg: 'size-14 text-size-lg' } as const;

export const avatarClasses = (size: AvatarSize, shape: AvatarShape) => {
  const base = cn('shrink-0', SIZES[size], shape === 'circle' ? 'rounded-full' : 'rounded-sm');
  return {
    image: cn(base, 'bg-border object-cover'),
    monogram: cn(base, 'flex items-center justify-center bg-primary-soft font-heading font-semibold text-primary-soft-foreground select-none'),
  };
};

/** Up to two initials (Maren Holt → MH, Dr Priya Raman → PR, Noor → NO). Titles (Dr, Prof …) are skipped. */
export const initials = (name: string) => {
  const words = name.trim().split(/\s+/).filter((w) => w && !/^(dr|mr|mrs|ms|mx|prof)\.?$/i.test(w));
  if (!words.length) return '';
  return words.length > 1 ? `${words[0][0]}${words.at(-1)![0]}`.toUpperCase() : words[0].slice(0, 2).toUpperCase();
};
