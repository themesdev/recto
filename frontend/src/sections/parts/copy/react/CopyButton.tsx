'use client';
// A copy button (../CopyButton.astro): copies `text`, the [data-copy-source] in the closest [data-copy-scope] (no
// text), or the page at `url` (Copy page). Icon only unless showLabel; the label always names it.
import { useEffect } from 'react';
import { Icon } from '../../icon/react/Icon';
import { copyButtonClasses, initCopy } from '../shared';

export interface CopyButtonProps {
  text?: string;
  url?: string;
  label: string;
  showLabel?: boolean;
  className?: string;
}

export function CopyButton({ text, url, label, showLabel = false, className }: CopyButtonProps) {
  useEffect(initCopy, []);
  const c = copyButtonClasses(showLabel, className);
  return (
    <button type="button" className={c.button} data-copy={url ? undefined : (text ?? '')} data-copy-url={url}>
      <Icon name="copy" size={16} className={c.copy} />
      <Icon name="check" size={16} className={c.check} />
      <span className={showLabel ? undefined : 'sr-only'}>{label}</span>
    </button>
  );
}

/** The copy listener alone, for copy buttons that come from server-rendered HTML (rich-text code blocks). Renders
 *  nothing. */
export function CopyInit() {
  useEffect(initCopy, []);
  return null;
}
