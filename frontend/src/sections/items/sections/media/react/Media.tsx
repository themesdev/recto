// Media (item.json): a wide image (image) or a video with its poster (video), with a caption and an optional heading.
import { SectionHead } from '../../../../parts/section-head/react/SectionHead';
import { headingId } from '../../../../parts/section-head/id';
import { spacingAttr, toneAttr } from '../../../../parts/kinds';
import { cn } from '../../../../recipes/cn';
import { captionId, markLabel, markerStyle, mediaClasses } from '../shared';
import { MEDIA_DEFAULTS, type MediaContent } from '../types';
import { srcSetProps } from '../../../../parts/image/responsive';

export interface MediaProps extends MediaContent {
  id?: string;
  className?: string;
}

export function Media({ eyebrow, heading, lead, image, video, captions, caption, callouts, markers, variant, tone, spacing, rules, id, className }: MediaProps) {
  const v = variant ?? MEDIA_DEFAULTS.variant;
  const c = mediaClasses(v);
  const hid = heading ? headingId(heading, id) : undefined;
  const cid = caption ? captionId(caption, id) : undefined;
  const marks = markers ?? MEDIA_DEFAULTS.markers;
  const dots = marks === 'dots';
  const Callouts = marks === 'numbers' ? 'ol' : 'ul';
  return (
    <section
      id={id}
      data-section="media"
      data-variant={v}
      data-tone={toneAttr(tone)}
      data-spacing={spacingAttr(spacing)} data-rules={rules ? '' : undefined}
      aria-labelledby={hid ?? cid}
      aria-label={hid || cid ? undefined : 'Media'}
      className={cn(c.root, className)}
    >
      <div className={c.inner}>
        {heading && hid ? <SectionHead eyebrow={eyebrow} heading={heading} lead={lead} headingId={hid} align={v === 'annotated' ? 'split' : 'center'} /> : null}
        {v === 'annotated' ? (
          <div className={c.body}>
            <figure className={c.annotatedFigure}>
              <div className={c.annotatedFrame}>
                <img src={image.src} {...srcSetProps(image, 'container')} alt={image.alt} width={image.width} height={image.height} className={c.media} loading="lazy" decoding="async" />
                {(callouts ?? []).map((k, i) => (
                  <span key={i} className={c.marker(dots)} style={markerStyle(k.x, k.y)} aria-hidden="true">
                    {markLabel(marks, i)}
                  </span>
                ))}
              </div>
              {caption ? (
                <figcaption id={cid} className={c.caption}>
                  {caption}
                </figcaption>
              ) : null}
            </figure>
            {callouts?.length ? (
              <Callouts role="list" className={c.callouts}>
                {callouts.map((k, i) => (
                  <li key={i} className={c.callout}>
                    <span className={c.number(dots)} aria-hidden="true">
                      {markLabel(marks, i)}
                    </span>
                    <div className={c.calloutBody}>
                      <h3 className={c.calloutTitle}>{k.title}</h3>
                      {k.text ? <p className={c.calloutText}>{k.text}</p> : null}
                    </div>
                  </li>
                ))}
              </Callouts>
            ) : null}
          </div>
        ) : (
          <figure className={c.figure}>
            <div className={c.frame}>
              {v === 'video' && video ? (
                <video controls preload="none" poster={image.src} width={image.width} height={image.height} aria-label={image.alt || undefined} className={c.video}>
                  <source src={video} />
                  {captions ? <track kind="captions" src={captions} label="Captions" default /> : null}
                </video>
              ) : (
                <img src={image.src} {...srcSetProps(image, 'container')} alt={image.alt} width={image.width} height={image.height} className={c.media} loading="lazy" decoding="async" />
              )}
            </div>
            {caption ? <figcaption id={cid} className={c.caption}>{caption}</figcaption> : null}
          </figure>
        )}
      </div>
    </section>
  );
}
