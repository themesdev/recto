// Previous and next page (../shared.ts).
import { Icon } from '../../icon/react/Icon';
import type { Link } from '../../kinds';
import { docsPagerClasses } from '../shared';

export interface DocsPagerProps {
  prev?: Link | null;
  next?: Link | null;
  className?: string;
}

export function DocsPager({ prev, next, className }: DocsPagerProps) {
  const c = docsPagerClasses(className);
  if (!prev && !next) return null;
  return (
    <nav aria-label="Previous and next page" className={c.nav}>
      {prev ? (
        <a href={prev.href} className={c.link(false)} rel="prev">
          <span className={c.label}>
            <Icon name="arrow-left" size={14} />
            Previous
          </span>
          <span className={c.title}>{prev.label}</span>
        </a>
      ) : null}
      {next ? (
        <a href={next.href} className={c.link(true)} rel="next">
          <span className={c.label}>
            Next
            <Icon name="arrow-right" size={14} />
          </span>
          <span className={c.title}>{next.label}</span>
        </a>
      ) : null}
    </nav>
  );
}
