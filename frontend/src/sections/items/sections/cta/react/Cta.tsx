// Call to action (item.json): a closing heading, a sentence and the page's main action again.
import { Actions } from '../../../../parts/actions/react/Actions';
import { SectionHead } from '../../../../parts/section-head/react/SectionHead';
import { headingId } from '../../../../parts/section-head/id';
import { spacingAttr, toneAttr } from '../../../../parts/kinds';
import { cn } from '../../../../recipes/cn';
import { ctaClasses } from '../shared';
import { CTA_DEFAULTS, type CtaContent } from '../types';

export interface CtaProps extends CtaContent {
  id?: string;
  className?: string;
}

export function Cta({ heading, lead, actions, note, variant, tone, spacing, rules, id, className }: CtaProps) {
  const v = variant ?? CTA_DEFAULTS.variant;
  const c = ctaClasses(v);
  const hid = headingId(heading, id);
  return (
    <section id={id} data-section="cta" data-variant={v} data-tone={toneAttr(tone)} data-spacing={spacingAttr(spacing)} data-rules={rules ? '' : undefined} aria-labelledby={hid} className={cn(c.root, className)}>
      <div className={c.inner}>
        <div className={c.box} data-tone={v === 'panel' ? 'inverse' : undefined}>
          <SectionHead heading={heading} lead={lead} headingId={hid} align={v === 'split' || v === 'row' ? 'start' : 'center'} size={v === 'row' ? 'compact' : 'section'} />
          <div className={c.cta}>
            <Actions actions={actions} className={c.actions} />
            {note ? <p className={c.note}>{note}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
