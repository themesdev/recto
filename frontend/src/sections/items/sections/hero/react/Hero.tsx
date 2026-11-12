// Hero (item.json): the page's h1 with its lead and buttons; text only (centered), beside an image (split), above it
// (stacked), over a full-bleed photo (overlay), or beside a code window with an install command (code).
import { LightField } from '../../../../parts/effects/react/LightField';
import { Actions } from '../../../../parts/actions/react/Actions';
import { CopyButton } from '../../../../parts/copy/react/CopyButton';
import { CodeWindow } from '../../../../parts/code-window/react/CodeWindow';
import { SectionHead } from '../../../../parts/section-head/react/SectionHead';
import { headingId } from '../../../../parts/section-head/id';
import { spacingAttr, toneAttr } from '../../../../parts/kinds';
import { BLEED_SIZES, bleedSrcset, focusStyle, srcSetProps } from '../../../../parts/image/responsive';
import { cn } from '../../../../recipes/cn';
import { heroClasses } from '../shared';
import { HERO_DEFAULTS, type HeroContent } from '../types';

export interface HeroProps extends HeroContent {
  id?: string;
  className?: string;
}

export function Hero({ eyebrow, heading, lead, actions, note, image, background, imageFocus, command, code, variant, tone, spacing, rules, id, className }: HeroProps) {
  const v = variant ?? HERO_DEFAULTS.variant;
  const c = heroClasses(v);
  const hid = headingId(heading, id);
  const align = v === 'split' || v === 'code' ? 'start' : 'center';
  const showCode = v === 'code' && code?.code;
  return (
    <section id={id} data-section="hero" data-variant={v} data-tone={toneAttr(tone)} data-spacing={spacingAttr(spacing)} data-rules={rules ? '' : undefined} aria-labelledby={hid} className={cn(c.root, className)}>
      {v !== 'overlay' && v !== 'centered' ? <LightField /> : null}
      {v === 'overlay' && background ? (
        <>
          <img src={background.src} srcSet={bleedSrcset(background)} sizes={BLEED_SIZES.full} alt={background.alt} width={background.width} height={background.height} className={c.ground} style={focusStyle(imageFocus)} loading="eager" decoding="async" fetchPriority="high" />
          <div className={c.scrim} />
        </>
      ) : null}
      {v === 'poster' ? (
        <div className={c.posterInner}>
          {eyebrow ? <p className={c.posterEyebrow}>{eyebrow}</p> : null}
          <h1 id={hid} className={c.posterHeading}>
            {heading}
          </h1>
          <div className={c.posterBase}>
            {note ? <p className={c.posterMeta}>{note}</p> : <span className={c.posterMeta} />}
            <div className={c.posterText}>
              {lead ? <p className={c.posterLead}>{lead}</p> : null}
              <Actions actions={actions} />
            </div>
          </div>
          {image ? (
            <div className={c.posterFigure}>
              <img src={image.src} {...srcSetProps(image, 'container')} alt={image.alt} width={image.width} height={image.height} className={c.image} loading="eager" decoding="async" fetchPriority="high" />
            </div>
          ) : null}
        </div>
      ) : v === 'panel' ? (
        <div className={c.posterInner}>
          <div className={c.panelTop}>
            <SectionHead as="h1" eyebrow={eyebrow} heading={heading} headingId={hid} className={c.panelHead} />
            <div className={c.panelText}>
              {lead ? <p className={c.panelLead}>{lead}</p> : null}
              <div className={c.panelCta}>
                <Actions actions={actions} />
                {note ? <p className={c.note}>{note}</p> : null}
              </div>
            </div>
          </div>
          {image ? (
            <div className={c.panel} data-tone="accent">
              <div className={c.panelFrame}>
                <img src={image.src} {...srcSetProps(image, 'container')} alt={image.alt} width={image.width} height={image.height} className={c.panelImage} loading="eager" decoding="async" fetchPriority="high" />
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className={c.inner}>
          <div className={c.text}>
            <SectionHead as="h1" align={align} eyebrow={eyebrow} heading={heading} lead={lead} headingId={hid} className={c.head} />
            {actions?.length || note || (v === 'code' && command) ? (
              <div className={c.cta}>
                <Actions actions={actions} className={c.actions} />
                {v === 'code' && command ? (
                  <div className={c.command} data-copy-scope="">
                    <span className={c.prompt} aria-hidden="true">
                      $
                    </span>
                    <code className={c.commandText} data-copy-source="">
                      {command}
                    </code>
                    <CopyButton label="Copy command" />
                  </div>
                ) : null}
                {note ? <p className={c.note}>{note}</p> : null}
              </div>
            ) : null}
          </div>
          {image && (v === 'split' || v === 'stacked') ? (
            <div className={c.figure}>
              <img src={image.src} {...srcSetProps(image, v === 'split' ? 'half' : 'container')} alt={image.alt} width={image.width} height={image.height} className={c.image} loading="eager" decoding="async" fetchPriority="high" />
            </div>
          ) : null}
          {showCode ? <CodeWindow code={code.code} language={code.language} filename={code.filename} className={c.window} /> : null}
        </div>
      )}
    </section>
  );
}
