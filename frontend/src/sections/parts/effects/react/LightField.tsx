// Soft light in the primary colours behind hero art; the parent is relative and isolate. Opacity: effect.light.opacity.
import { cn } from '../../../recipes/cn';

export function LightField({ className }: { className?: string }) {
  return <span className={cn('s-light', className)} aria-hidden="true" />;
}
