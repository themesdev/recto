// Reads the active preset (the `@import './presets/<name>.css'` line in src/styles/global.css) and its colours, for
// the things CSS can't reach: the Open Graph images (tools/og-assets.mjs) and the demo drawings (tools/draw-demo.mjs).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** @param {string} root the project folder */
export function activePreset(root = process.cwd()) {
  const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
  const m = css.match(/^@import '\.\/presets\/([a-z0-9-]+)\.css';/m);
  if (!m) throw new Error('src/styles/global.css imports no preset (@import \'./presets/<name>.css\';)');
  return m[1];
}

/** The custom properties of the first rule set whose selector line matches. */
function block(css, selector) {
  const i = css.indexOf(`${selector} {`);
  if (i < 0) return null;
  const body = css.slice(css.indexOf('{', i) + 1, css.indexOf('}', i));
  // A font stack starts with the next/font variable (var(--font-preset-…)): outside the site (drawings, Open Graph
  // images) only the family names after it count.
  return Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim().replace(/^(var\(--font-preset-[a-z]+\),\s*)+/, '')]));
}

/**
 * @param {string} [name] a preset name; the active one by default
 * @param {string} [root]
 * @returns {{ name: string, modes: string[], light: Record<string,string>, dark: Record<string,string> | null, inverse: Record<string,string> | null }}
 */
export function presetPalette(name, root = process.cwd()) {
  const preset = name ?? activePreset(root);
  const css = readFileSync(join(root, 'src/styles/presets', `${preset}.css`), 'utf8');
  const modes = (css.match(/modes: ([a-z ]+)/)?.[1] ?? 'light').trim().split(/\s+/);
  const base = block(css, ':root');
  if (!base) throw new Error(`src/styles/presets/${preset}.css has no :root block`);
  const dark = block(css, ":root[data-theme='dark']");
  const inverse = block(css, "[data-tone='inverse']");
  return { name: preset, modes, light: base, dark: dark ? { ...base, ...dark } : null, inverse: inverse ? { ...base, ...inverse } : null };
}

/** The first family in a font stack: "Newsreader Variable", Newsreader, serif → Newsreader */
export const firstFamily = (stack) => stack.split(',')[0].replace(/["']/g, '').replace(/ Variable$/, '').trim();
