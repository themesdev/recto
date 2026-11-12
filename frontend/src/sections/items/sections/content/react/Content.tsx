// Content (item.json): a heading and blocks of prose (optional subheading, paragraphs); one column or beside the heading.
import { SectionHead } from '../../../../parts/section-head/react/SectionHead';
import { headingId } from '../../../../parts/section-head/id';
import { spacingAttr, toneAttr } from '../../../../parts/kinds';
import { paragraphs } from '../../../../parts/text';
import { cn } from '../../../../recipes/cn';
import { contentClasses } from '../shared';
import { CONTENT_DEFAULTS, type ContentContent } from '../types';

export interface ContentProps extends ContentContent {
  id?: string;
  className?: string;
}

export function Content({ eyebrow, heading, lead, blocks, variant, tone, spacing, rules, id, className }: ContentProps) {
  const v = variant ?? CONTENT_DEFAULTS.variant;
  const c = contentClasses(v, blocks.length);
  const hid = headingId(heading, id);
  return (
    <section id={id} data-section="content" data-variant={v} data-tone={toneAttr(tone)} data-spacing={spacingAttr(spacing)} data-rules={rules ? '' : undefined} aria-labelledby={hid} className={cn(c.root, className)}>
      <div className={c.inner}>
        <SectionHead eyebrow={eyebrow} heading={heading} lead={lead} headingId={hid} size={v === 'statement' ? 'display' : 'section'} className={c.head} />
        <div className={c.prose}>
          {blocks.map((b, i) => (
            <div key={i} className={c.block}>
              {b.heading ? <h3 className={v === 'statement' ? c.blockHeading : c.subheading}>{b.heading}</h3> : null}
              {paragraphs(b.text).map((p, j) => (
                <p key={j} className={c.paragraph}>{p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
