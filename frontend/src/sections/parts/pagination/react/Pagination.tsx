// Previous, the page numbers and next, as links. The current page is marked aria-current="page"; at either end the step
// that leads nowhere is plain text.
import { Icon } from '../../icon/react/Icon';
import { cn } from '../../../recipes/cn';
import { pageHref, pageItems, paginationClasses as c, type PaginationInfo } from '../shared';

export interface PaginationProps extends PaginationInfo {
  /** The landmark's name (two lists on a page need two names). */
  label?: string;
  previousText?: string;
  nextText?: string;
  className?: string;
}

export function Pagination({ label = 'Pagination', previousText = 'Previous', nextText = 'Next', className, ...info }: PaginationProps) {
  const { page, pages } = info;
  if (pages <= 1) return null;
  return (
    <nav aria-label={label} className={cn(c.root, className)}>
      <ul role="list" className={c.list}>
        <li>
          {page > 1 ? (
            <a href={pageHref(info, page - 1)} rel="prev" className={c.step}>
              <Icon name="arrow-right" size={16} className={c.prevIcon} />
              <span className={c.stepLabel}>{previousText}</span>
            </a>
          ) : (
            <span className={c.stepOff}>
              <Icon name="arrow-right" size={16} className={c.prevIcon} />
              <span className={c.stepLabel}>{previousText}</span>
            </span>
          )}
        </li>
        {pageItems(page, pages).map((n, i) => (
          <li key={i}>
            {n === 'gap' ? (
              <span className={c.gap}>…</span>
            ) : (
              <a href={pageHref(info, n)} aria-label={`Page ${n}`} aria-current={n === page ? 'page' : undefined} className={c.number(n === page)}>
                {n}
              </a>
            )}
          </li>
        ))}
        <li>
          {page < pages ? (
            <a href={pageHref(info, page + 1)} rel="next" className={c.step}>
              <span className={c.stepLabel}>{nextText}</span>
              <Icon name="arrow-right" size={16} />
            </a>
          ) : (
            <span className={c.stepOff}>
              <span className={c.stepLabel}>{nextText}</span>
              <Icon name="arrow-right" size={16} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
