'use client';
// Announcement bar (item.json): one sentence and an optional link above the header; optionally dismissible, remembered
// per text in localStorage (read after hydration, as the Astro script does after load).
import { useEffect, useState } from 'react';
import { Icon } from '../../../../parts/icon/react/Icon';
import { toneAttr } from '../../../../parts/kinds';
import { cn } from '../../../../recipes/cn';
import { announcementClasses, announcementKey, dismissedKey } from '../shared';
import { ANNOUNCEMENT_DEFAULTS, type AnnouncementContent } from '../types';

export interface AnnouncementProps extends AnnouncementContent {
  id?: string;
  className?: string;
}

export function Announcement({ text, link, dismissible, variant, tone, id, className }: AnnouncementProps) {
  const v = variant ?? ANNOUNCEMENT_DEFAULTS.variant;
  const closable = dismissible ?? ANNOUNCEMENT_DEFAULTS.dismissible;
  const c = announcementClasses(closable);
  const key = announcementKey(text);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (!closable) return;
    try {
      if (localStorage.getItem(dismissedKey(key))) setDismissed(true);
    } catch {}
  }, [closable, key]);

  return (
    <section
      id={id}
      data-section="announcement"
      data-variant={v}
      data-tone={toneAttr(tone)}
      aria-label="Announcement"
      className={cn(c.root, className)}
      data-announcement={closable ? key : undefined}
      hidden={dismissed}
    >
      <div className={c.inner}>
        {closable ? <span className={c.spacer} aria-hidden="true" /> : null}
        <p className={c.text}>
          <span>{text}</span>
          {link ? (
            <a href={link.href} className={c.link}>
              {link.label}
              <Icon name="arrow-right" size={16} />
            </a>
          ) : null}
        </p>
        {closable ? (
          <button
            type="button"
            className={c.close}
            aria-label="Dismiss announcement"
            data-announcement-dismiss=""
            onClick={() => {
              setDismissed(true);
              try {
                localStorage.setItem(dismissedKey(key), '1');
              } catch {}
            }}
          >
            <Icon name="x" size={18} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
