// The brand: its logo (alt = the name) or the name in type, linking home.
import type { ImageRef } from '../../kinds';
import { cn } from '../../../recipes/cn';
import { brandClasses as c } from '../shared';
import { srcSetProps } from '../../image/responsive';

export interface BrandProps {
  name: string;
  logo?: ImageRef | null;
  href?: string | null;
  className?: string;
}

export function Brand({ name, logo, href, className }: BrandProps) {
  return (
    <a href={href ?? '/'} className={cn(c.link, className)}>
      {logo ? <img src={logo.src} {...srcSetProps(logo, 'logo')} alt={name} width={logo.width} height={logo.height} className={c.logo} /> : <span>{name}</span>}
    </a>
  );
}
