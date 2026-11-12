// The recto preset's fonts (SIL Open Font License 1.1, from Fontsource), self-hosted by next/font: preloaded, with a
// fallback font sized to match so nothing shifts while they load. Each one fills a CSS variable that the preset's
// --font-sans, --font-heading and --font-mono start with (src/styles/presets/recto.css). Latin only: for other
// scripts, add the matching Fontsource file (latin-ext, cyrillic …). Fonts: Literata, Instrument Sans, JetBrains Mono.
import localFont from 'next/font/local';

export const heading = localFont({
  src: [{ path: '../../../node_modules/@fontsource-variable/literata/files/literata-latin-wght-normal.woff2', weight: '200 900', style: 'normal' }],
  variable: '--font-preset-heading',
  display: 'swap',
  preload: true,
  fallback: ['ui-serif', 'Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
});
export const sans = localFont({
  src: [{ path: '../../../node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2', weight: '400 700', style: 'normal' }],
  variable: '--font-preset-sans',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
export const mono = localFont({
  src: [{ path: '../../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', weight: '100 800', style: 'normal' }],
  variable: '--font-preset-mono',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  adjustFontFallback: 'Arial',
});

/** The classes that define the variables: on <html>. */
export const fontVariables = [heading.variable, sans.variable, mono.variable].join(' ');
