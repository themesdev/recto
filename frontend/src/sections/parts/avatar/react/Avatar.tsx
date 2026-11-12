// The visual of an attribution (../shared.ts): the photo (decorative: the name follows it) or a monogram tile.
import type { ImageRef } from '../../kinds';
import { cn } from '../../../recipes/cn';
import { avatarClasses, initials, type AvatarShape, type AvatarSize } from '../shared';
import { srcSetProps } from '../../image/responsive';

export interface AvatarProps {
  name: string;
  image?: ImageRef | null;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
}

export function Avatar({ name, image, size = 'md', shape = 'circle', className }: AvatarProps) {
  const c = avatarClasses(size, shape);
  return image ? (
    <img src={image.src} {...srcSetProps(image, 'avatar')} alt="" width={image.width} height={image.height} className={cn(c.image, className)} loading="lazy" decoding="async" />
  ) : (
    <span className={cn(c.monogram, className)} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
