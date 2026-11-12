// Lines written out in turn (code, a prompt, a log). The whole text is there from the start: a clip uncovers it.
import { cn } from '../../../recipes/cn';
import { typeLineStyle } from '../shared';

export function Typing({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <span className={cn('flex flex-col', className)}>
      {lines.map((line, i) => (
        <span key={i} className="s-type block whitespace-pre" style={typeLineStyle(i, line)}>
          {line || '\u00a0'}
        </span>
      ))}
    </span>
  );
}
