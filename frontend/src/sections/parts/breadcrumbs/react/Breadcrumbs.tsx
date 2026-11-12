// Where the page sits (../breadcrumbs.ts): links up to the current page, which is the last item and not a link. With
// `site`, the same trail also goes out as BreadcrumbList JSON-LD, so one component covers both.
import { Icon } from '../../icon/react/Icon';
import { JsonLd } from '../../seo/react/JsonLd';
import type { SiteUrl } from '../../seo/json-ld';
import { breadcrumbJsonLd, type Crumb } from '../breadcrumbs';
import { breadcrumbsClasses } from '../shared';

export interface BreadcrumbsProps {
  items: Crumb[];
  /** The site's origin: also write the BreadcrumbList JSON-LD. */
  site?: SiteUrl | null;
  /** The page's path, when the last crumb has no href. */
  page?: string | null;
  className?: string;
}

export function Breadcrumbs({ items, site, page, className }: BreadcrumbsProps) {
  const c = breadcrumbsClasses(className);
  return (
    <>
      <nav aria-label="Breadcrumb" className={c.nav}>
        <ol role="list" className={c.list}>
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={i} className={c.item}>
                {i > 0 ? <Icon name="chevron-right" size={14} /> : null}
                {last || !item.href ? (
                  <span className={last ? c.current : undefined} aria-current={last ? 'page' : undefined}>
                    {item.label}
                  </span>
                ) : (
                  <a href={item.href} className={c.link}>
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {site ? <JsonLd data={breadcrumbJsonLd(items, site, page)} /> : null}
    </>
  );
}
