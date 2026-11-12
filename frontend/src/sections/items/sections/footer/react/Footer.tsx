// Footer (item.json): brand and tagline, groups of links (columns) or one row of them (stacked), and the legal line.
import { Actions } from '../../../../parts/actions/react/Actions';
import { StatusPulse } from '../../../../parts/effects/react/StatusPulse';
import { Brand } from '../../../../parts/brand/react/Brand';
import { SocialIcon } from '../../../../parts/icon/react/SocialIcon';
import { SOCIAL_ICONS } from '../../../../parts/icon/icon-nodes';
import { toneAttr } from '../../../../parts/kinds';
import { cn } from '../../../../recipes/cn';
import { footerClasses, socialRel } from '../shared';
import { FOOTER_DEFAULTS, type FooterContent } from '../types';
import { srcSetProps } from '../../../../parts/image/responsive';

export interface FooterProps extends FooterContent {
  id?: string;
  className?: string;
}

export function Footer({ brand, closing, contact, offices, status, visual, columns, social, legal, legalLinks, variant, tone, id, className }: FooterProps) {
  const v = variant ?? FOOTER_DEFAULTS.variant;
  const c = footerClasses(v);
  const base = id ?? 'site-footer';
  const { tagline, ...brandLink } = brand;
  const tel = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;
  return (
    <footer id={id} data-section="footer" data-variant={v} data-tone={toneAttr(tone)} className={cn(c.root, className)}>
      <div className={c.inner}>
        {v === 'cta' && closing ? (
          <div className={c.closing} data-tone="accent">
            <div className={c.closingText}>
              <h2 className={c.closingHeading}>{closing.heading}</h2>
              {closing.text ? <p className={c.closingLead}>{closing.text}</p> : null}
            </div>
            <Actions actions={closing.actions} className={c.closingActions} />
          </div>
        ) : null}
        {v === 'editorial' && closing ? (
          <div className={c.statement}>
            <p className={c.statementText}>{closing.heading}</p>
            {closing.text ? <p className={c.closingLead}>{closing.text}</p> : null}
            <Actions actions={closing.actions} />
          </div>
        ) : null}
        <div className={c.top}>
          <div className={c.brand}>
            <Brand {...brandLink} />
            {tagline ? <p className={c.tagline}>{tagline}</p> : null}
            {v === 'product' && status ? (
              status.href ? (
                <a href={status.href} className={c.status}>
                  <StatusPulse status={status.state ?? 'live'} label={status.label} />
                </a>
              ) : (
                <StatusPulse status={status.state ?? 'live'} label={status.label} />
              )
            ) : null}
            {social?.length ? (
              <ul role="list" aria-label="Social media" className={c.social}>
                {social.map((s, i) => (
                  <li key={i}>
                    <a href={s.url} rel={socialRel(s.platform)} className={c.socialLink}>
                      <SocialIcon name={s.platform} />
                      <span className="sr-only">{SOCIAL_ICONS[s.platform].title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {v === 'editorial' && (contact || offices?.length) ? (
            <div className={c.contact}>
              <h2 id={`${base}-contact`} className={c.contactTitle}>
                Contact
              </h2>
              {contact ? (
                <address className={c.address}>
                  {contact.email ? <a href={`mailto:${contact.email}`} className={c.contactLink}>{contact.email}</a> : null}
                  {contact.phone ? <a href={tel(contact.phone)} className={c.contactLink}>{contact.phone}</a> : null}
                  {contact.address ? contact.address.split('\n').map((line, i) => <span key={i}>{line}</span>) : null}
                </address>
              ) : null}
              {offices?.length ? (
                <ul role="list" aria-label="Offices" className={c.offices}>
                  {offices.map((o, i) => (
                    <li key={i} className={c.office}>
                      <span className={c.city}>{o.city}</span>
                      {o.detail ? <span className={c.hours}>{o.detail}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
          {v === 'stacked' ? (
            columns?.length ? (
              <nav aria-label="Footer">
                <ul role="list" className={c.row}>
                  {columns
                    .flatMap((col) => col.links)
                    .map((l, i) => (
                      <li key={i}>
                        <a href={l.href} className={c.link}>{l.label}</a>
                      </li>
                    ))}
                </ul>
              </nav>
            ) : null
          ) : columns?.length ? (
            <div className={c.groups}>
              {columns.map((col, i) => (
                <nav key={i} aria-labelledby={`${base}-group-${i}`} className={c.group}>
                  <h2 id={`${base}-group-${i}`} className={c.groupTitle}>{col.title}</h2>
                  <ul role="list" className={c.groupList}>
                    {col.links.map((l, j) => (
                      <li key={j}>
                        <a href={l.href} className={c.link}>{l.label}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          ) : null}
          {v === 'product' && visual ? (
            <div className={c.visual}>
              <img src={visual.src} {...srcSetProps(visual, 'thirdStacked')} alt={visual.alt} width={visual.width} height={visual.height} className={c.visualImage} loading="lazy" decoding="async" />
            </div>
          ) : null}
        </div>
        <div className={c.legal}>
          <p>{legal}</p>
          {legalLinks?.length ? (
            <nav aria-label="Legal">
              <ul role="list" className={c.legalList}>
                {legalLinks.map((l, i) => (
                  <li key={i}>
                    <a href={l.href} className={c.legalLink}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        {v === 'wordmark' ? (
          <p className={c.wordmark} style={{ '--wm-chars': brand.name.length } as React.CSSProperties} aria-hidden="true">
            {brand.name}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
