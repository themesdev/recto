// Team (item.json): the people behind the product, as cards in a grid or as a compact list; photo or initials, name,
// role and up to three links each.
import { Icon } from '../../../../parts/icon/react/Icon';
import { SectionHead } from '../../../../parts/section-head/react/SectionHead';
import { headingId } from '../../../../parts/section-head/id';
import { spacingAttr, toneAttr } from '../../../../parts/kinds';
import { cn } from '../../../../recipes/cn';
import { initials, teamClasses } from '../shared';
import { TEAM_DEFAULTS, type TeamContent } from '../types';
import { srcSetProps } from '../../../../parts/image/responsive';

export interface TeamProps extends TeamContent {
  id?: string;
  className?: string;
}

export function Team({ eyebrow, heading, lead, people, link, variant, tone, spacing, rules, id, className }: TeamProps) {
  const v = variant ?? TEAM_DEFAULTS.variant;
  const c = teamClasses(v);
  const hid = headingId(heading, id);
  return (
    <section id={id} data-section="team" data-variant={v} data-tone={toneAttr(tone)} data-spacing={spacingAttr(spacing)} data-rules={rules ? '' : undefined} aria-labelledby={hid} className={cn(c.root, className)}>
      <div className={c.inner}>
        <SectionHead eyebrow={eyebrow} heading={heading} lead={lead} headingId={hid} align={v === 'portraits' ? 'split' : 'center'} />
        <ul role="list" className={c.list}>
          {people.map((p, i) => (
            <li key={i} className={c.item}>
              {p.avatar ? (
                <img src={p.avatar.src} {...srcSetProps(p.avatar, v === 'portraits' ? 'quarter' : 'avatar')} alt={p.avatar.alt} width={p.avatar.width} height={p.avatar.height} className={c.avatar} loading="lazy" decoding="async" />
              ) : (
                <span className={c.initials} aria-hidden="true">{initials(p.name)}</span>
              )}
              <div className={c.body}>
                <h3 className={c.name}>{p.name}</h3>
                <p className={c.role}>{p.role}</p>
                {p.links?.length ? (
                  <ul role="list" className={c.links}>
                    {p.links.map((l, j) => (
                      <li key={j}>
                        <a href={l.href} className={c.link}>
                          {l.label}
                          <span className="sr-only">{`, ${p.name}`}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        {link ? (
          <p className={c.more}>
            <a href={link.href} className={c.moreLink}>
              {link.label}
              <Icon name="arrow-right" size={16} />
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
