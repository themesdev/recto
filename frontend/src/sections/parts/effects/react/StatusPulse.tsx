// A status with a pulsing dot (live, down) or a still one (idle); the label says the status in words.
import { statusClasses, type Status } from '../shared';

export function StatusPulse({ status = 'live', label }: { status?: Status; label: string }) {
  const c = statusClasses(status);
  return (
    <span className={c.root}>
      <span className={c.dot} data-still={status === 'idle' ? '' : undefined} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
