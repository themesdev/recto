'use client';
// On this page (../shared.ts): the page's h2 and h3; the heading in view is marked as you scroll.
import { useEffect, useRef } from 'react';
import { docsTocClasses, watchToc, type DocsHeading } from '../shared';

export interface DocsTocProps {
  headings: DocsHeading[];
  label?: string;
  className?: string;
}

export function DocsToc({ headings, label = 'On this page', className }: DocsTocProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => (ref.current ? watchToc(ref.current) : undefined), [headings]);
  const c = docsTocClasses(className);
  if (!headings.length) return null;
  return (
    <nav ref={ref} aria-labelledby="docs-toc-title" className={c.nav} data-docs-toc="">
      <p id="docs-toc-title" className={c.title}>
        {label}
      </p>
      <ul role="list" className={c.list}>
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className={c.link(h.depth)}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
