// Open Graph images (1200×630 PNG), drawn with next/og in the active preset's colours and fonts (./assets.generated.ts,
// written by tools/og-assets.mjs).
import { ImageResponse } from 'next/og';
import { bodyFont, colours as c, headingFont } from './assets.generated';

const bytes = (b64: string) => Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0)).buffer;

export function ogImage({ title, description, eyebrow, siteName, host }: { title: string; description: string; eyebrow: string; siteName: string; host: string }) {
  const text = description.length > 150 ? `${description.slice(0, 147)}…` : description;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', background: c.background, color: c.foreground, fontFamily: 'Body', borderTop: `16px solid ${c.primary}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 28 }}>
          <div style={{ fontFamily: 'Heading', fontSize: 40 }}>{siteName}</div>
          <div style={{ color: c['muted-foreground'], textTransform: 'uppercase', letterSpacing: 3, fontSize: 22 }}>{eyebrow}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: 'Heading', fontSize: title.length > 60 ? 60 : 72, lineHeight: 1.08, letterSpacing: -1 }}>{title}</div>
          <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.4, color: c['muted-foreground'] }}>{text}</div>
        </div>
        <div style={{ display: 'flex', borderTop: `2px solid ${c.border}`, paddingTop: 24, fontSize: 22, color: c['muted-foreground'] }}>{host}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Heading', data: bytes(headingFont), weight: 500, style: 'normal' },
        { name: 'Body', data: bytes(bodyFont), weight: 400, style: 'normal' },
      ],
    },
  );
}
