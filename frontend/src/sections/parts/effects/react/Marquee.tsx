'use client';
// A row of short items moving slowly, with a pause button (WCAG 2.2.2); still and wrapped with reduced motion.
import { useEffect } from 'react';
import { Icon } from '../../icon/react/Icon';
import { initMarquee } from '../reveal';
import { marqueeClasses as c, marqueeStyle } from '../shared';

export function Marquee({ items, label }: { items: string[]; label: string }) {
  // The same listener as the Astro version (../reveal.ts › initMarquee): it toggles aria-pressed and data-paused.
  useEffect(() => initMarquee(), []);
  return (
    <div className={c.root} data-marquee="">
      <div className={c.head}>
        <button type="button" className={c.pause} aria-pressed="false" aria-label={`Pause ${label}`} data-marquee-pause="">
          <Icon name="pause" size={20} className={c.pauseIcon} />
          <Icon name="play" size={20} className={c.playIcon} />
        </button>
      </div>
      <div className="s-marquee" style={marqueeStyle(items.length)}>
        <div className="s-marquee-rail">
          {[false, true].map((clone) => (
            <ul key={String(clone)} role="list" aria-label={clone ? undefined : label} className={clone ? `${c.list} ${c.clone}` : c.list} aria-hidden={clone ? 'true' : undefined} inert={clone || undefined}>
              {items.map((item, i) => (
                <li key={i} className={c.item}>
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
