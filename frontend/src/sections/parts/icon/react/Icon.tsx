// A Lucide icon from the sections' set (parts/icon/icon-nodes.ts). Decorative unless it has a label.
import { createElement } from 'react';
import { ICON_NODES, type IconName } from '../icon-nodes';

export interface IconProps {
  name: IconName;
  size?: number;
  label?: string;
  className?: string;
}

export function Icon({ name, size = 24, label, className }: IconProps) {
  const nodes = ICON_NODES[name] ?? [];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      focusable="false"
    >
      {nodes.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}
