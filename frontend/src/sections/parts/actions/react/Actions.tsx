// A row of links drawn as buttons. Without an explicit emphasis the first is primary and the rest secondary.
import type { Action } from '../../kinds';
import { action } from '../../../recipes/action';
import { cn } from '../../../recipes/cn';

export interface ActionsProps {
  actions?: Action[] | null;
  className?: string;
  /** Classes for each button (w-full on narrow screens). */
  itemClass?: string;
}

export function Actions({ actions, className, itemClass }: ActionsProps) {
  if (!actions?.length) return null;
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {actions.map((a, i) => (
        <a key={i} href={a.href} className={cn(action({ emphasis: a.emphasis ?? (i === 0 ? 'primary' : 'secondary') }), itemClass)}>
          {a.label}
        </a>
      ))}
    </div>
  );
}
