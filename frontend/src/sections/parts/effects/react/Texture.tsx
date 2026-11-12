// A grain or grid layer over a ground (../shared.ts); the parent is relative and isolate. Opacity: effect.texture.opacity.
import { textureClass, type TextureKind } from '../shared';

export function Texture({ kind = 'grain', className }: { kind?: TextureKind; className?: string }) {
  return <span className={textureClass(kind, className)} aria-hidden="true" />;
}
