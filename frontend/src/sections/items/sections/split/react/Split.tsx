// Split (item.json): one idea told at length beside a large image; the image on the end side or the start side.
import { Actions } from '../../../../parts/actions/react/Actions';
import { Icon } from '../../../../parts/icon/react/Icon';
import { SectionHead } from '../../../../parts/section-head/react/SectionHead';
import { headingId } from '../../../../parts/section-head/id';
import { spacingAttr, toneAttr } from '../../../../parts/kinds';
import { BLEED_SIZES, bleedSrcset, focusStyle, srcSetProps } from '../../../../parts/image/responsive';
import { cn } from '../../../../recipes/cn';
import { splitClasses } from '../shared';
import { SPLIT_DEFAULTS, type SplitContent } from '../types';

export interface SplitProps extends SplitContent {
  id?: string;
  className?: string;
}

export function Split({ eyebrow, heading, lead, points, actions, image, imageFocus, variant, tone, spacing, rules, id, className }: SplitProps) {
  const v = variant ?? SPLIT_DEFAULTS.variant;
  const c = splitClasses(v);
  const hid = headingId(heading, id);
  return (
    <section id={id} data-section="split" data-variant={v} data-tone={toneAttr(tone)} data-spacing={spacingAttr(spacing)} data-rules={rules ? '' : undefined} aria-labelledby={hid} className={cn(c.root, className)}>
      <div className={c.inner}>
        <div className={c.text}>
          <SectionHead eyebrow={eyebrow} heading={heading} lead={lead} headingId={hid} />
          {points?.length ? (
            <ul role="list" className={c.points}>
              {points.map((p, i) => (
                <li key={i} className={c.point}>
                  <Icon name="check" size={16} className={c.check} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <Actions actions={actions} />
        </div>
        <div className={c.figure}>
          <img src={image.src} {...(v === 'bleed' ? { srcSet: bleedSrcset(image), sizes: BLEED_SIZES.split } : srcSetProps(image, 'half'))} style={focusStyle(imageFocus)} alt={image.alt} width={image.width} height={image.height} className={c.image} loading="lazy" decoding="async" />
        </div>
      </div>
    </section>
  );
}
