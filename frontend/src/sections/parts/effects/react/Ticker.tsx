// A value that updates in place (a counter, a status): the first is read; the others take turns on screen only.
import { cn } from '../../../recipes/cn';
import { tickStyle, tickValueStyle } from '../shared';

export function Ticker({ values, className }: { values: string[]; className?: string }) {
  return (
    <span className={cn('s-tick tabular-nums', className)} style={tickStyle(values.length)}>
      {values.slice(0, 4).map((v, i) => (
        <span key={i} style={tickValueStyle(i)} aria-hidden={i > 0 ? 'true' : undefined}>
          {v}
        </span>
      ))}
    </span>
  );
}
