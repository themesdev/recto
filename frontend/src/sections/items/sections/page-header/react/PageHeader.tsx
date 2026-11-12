// Page header (item.json): an inner page's h1 at section-heading size, with breadcrumb, eyebrow and lead; aligned to the
// start (stacked) or centred (centered).
import { headingId } from '../../../../parts/section-head/id';
import { spacingAttr, toneAttr } from '../../../../parts/kinds';
import { cn } from '../../../../recipes/cn';
import { pageHeaderClasses } from '../shared';
import { PAGE_HEADER_DEFAULTS, type PageHeaderContent } from '../types';

export interface PageHeaderProps extends PageHeaderContent {
  id?: string;
  className?: string;
}

export function PageHeader({ breadcrumb, eyebrow, heading, lead, variant, tone, spacing, rules, id, className }: PageHeaderProps) {
  const v = variant ?? PAGE_HEADER_DEFAULTS.variant;
  const c = pageHeaderClasses(v);
  const hid = headingId(heading, id);
  return (
    <section id={id} data-section="page-header" data-variant={v} data-tone={toneAttr(tone)} data-spacing={spacingAttr(spacing)} data-rules={rules ? '' : undefined} aria-labelledby={hid} className={cn(c.root, className)}>
      <div className={c.inner}>
        <div className={c.body}>
          {breadcrumb?.length ? (
            <nav aria-label="Breadcrumb">
              <ol role="list" className={c.crumbs}>
                {breadcrumb.map((b, i) => (
                  <li key={i} className={c.crumb}>
                    <a href={b.href} className={c.link}>
                      {b.label}
                    </a>
                    <span aria-hidden="true" className={c.sep}>
                      /
                    </span>
                  </li>
                ))}
                <li className={c.crumb}>
                  <span aria-current="page" className={c.current}>
                    {heading}
                  </span>
                </li>
              </ol>
            </nav>
          ) : null}
          <div className={c.head}>
            {eyebrow ? <p className={c.eyebrow}>{eyebrow}</p> : null}
            <h1 id={hid} className={c.heading}>
              {heading}
            </h1>
            {lead ? <p className={c.lead}>{lead}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
