// A social mark from the sections' set (parts/icon/icon-nodes.ts › SOCIAL_ICONS, Simple Icons, CC0 1.0): one filled
// path in the text colour. Decorative: the link around it carries the platform's name.
import { SOCIAL_ICONS, type SocialPlatform } from '../icon-nodes';

export interface SocialIconProps {
  name: SocialPlatform;
  size?: number;
  className?: string;
}

export function SocialIcon({ name, size = 20, className }: SocialIconProps) {
  const icon = SOCIAL_ICONS[name];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      {icon ? <path d={icon.path} /> : null}
    </svg>
  );
}
