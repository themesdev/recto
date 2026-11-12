// Eyebrow, heading and lead at the top of a section. The heading carries the id the section is labelled by.
import { cn } from '../../../recipes/cn';
import { headClasses, type HeadAlign, type HeadSize } from '../shared';

export interface SectionHeadProps {
  eyebrow?: string | null;
  heading: string;
  lead?: string | null;
  headingId: string;
  as?: 'h1' | 'h2';
  align?: HeadAlign;
  /** h2 only: compact draws a smaller heading (bands); display an h2 at the display size (an editorial head). */
  size?: HeadSize;
  className?: string;
}

export function SectionHead({ eyebrow, heading, lead, headingId, as: Tag = 'h2', align = 'start', size = 'section', className }: SectionHeadProps) {
  const c = headClasses(align, Tag === 'h1' ? 'display' : size);
  return (
    <div className={cn(c.root, className)}>
      {align === 'split' ? (
        <div className={c.title}>
          {eyebrow ? <p className={c.eyebrow}>{eyebrow}</p> : null}
          <Tag id={headingId} className={c.heading}>{heading}</Tag>
        </div>
      ) : (
        <>
          {eyebrow ? <p className={c.eyebrow}>{eyebrow}</p> : null}
          <Tag id={headingId} className={c.heading}>{heading}</Tag>
        </>
      )}
      {lead ? <p className={c.lead}>{lead}</p> : null}
    </div>
  );
}
