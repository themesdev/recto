// Design rules for the theme's own files (src/, outside the vendored src/sections/ and generated files):
//   - colours come from the preset: no #hex, rgb() or hsl() outside src/styles/presets/ (the Open Graph image takes
//     its colours from the generated preset file), no Tailwind palette classes (bg-blue-500), no dark: variants
//     (dark mode lives in the preset's custom properties);
//   - no arbitrary values (w-[37px]) except custom properties (py-(--space-section));
//   - every <img> has alt, width and height (no layout shift; alt="" only for decorative images);
//   - every image the demo content (seed/) points to exists in public/.
// It also lists the pages that still hold placeholder text (<span className="placeholder">) and the legal
// pages that still hold the demo's sample text (<LegalPage isSample>), as a reminder.
// Usage: pnpm lint (after ESLint)   Exit 1 when a rule is broken.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};
const files = walk(join(root, 'src')).filter((f) => !f.startsWith(join(root, 'src/sections')) && !f.endsWith('.generated.ts') && /\.(tsx?|css)$/.test(f));
const problems = [];
const placeholders = [];
const samples = [];
const say = (f, line, msg) => problems.push(`${relative(root, f)}:${line}: ${msg}`);

for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const rel = relative(root, f);
  const isPreset = rel.startsWith('src/styles/presets/');
  const isCode = /\.tsx?$/.test(f);
  text.split('\n').forEach((line, i) => {
    const n = i + 1;
    if (!isPreset && /\.(tsx|css)$/.test(f) && /(#[0-9a-fA-F]{3,8}\b(?![\w-]*["']?\s*:)|\brgba?\(|\bhsla?\()/.test(line.replace(/href="[^"]*"/g, '').replace(/&#\d+;/g, '')))
      say(f, n, 'a raw colour: use a token (var(--primary), bg-card …)');
    if (isCode && /\bdark:[a-z]/.test(line)) say(f, n, 'a dark: variant: dark values belong in the preset');
    if (isCode && /\b(bg|text|border|ring|fill|stroke|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/.test(line))
      say(f, n, 'a Tailwind palette class: use a token colour');
    if (isCode && /className=.*\b[a-z-]+-\[(?!var\()[^\]]+\]/.test(line)) say(f, n, 'an arbitrary value: use a token or a spacing step');
  });
  if (rel.endsWith('.tsx'))
    for (const m of text.matchAll(/<img\b[^>]*>/g)) {
      const n = text.slice(0, m.index).split('\n').length;
      for (const a of ['alt', 'width', 'height']) if (!new RegExp(`\\s${a}=|\\{\\.\\.\\.`).test(m[0])) say(f, n, `<img> without ${a}`);
    }
  if (/className="placeholder"/.test(text)) placeholders.push(rel);
  if (/<LegalPage\b[^>]*\sisSample\b/.test(text)) samples.push(rel);
}

// The demo content's images must exist, and every image it refers to must be listed in seed/assets.json.
const assets = JSON.parse(readFileSync(join(root, 'seed/assets.json'), 'utf8'));
for (const a of assets) if (!existsSync(join(root, 'public', a.path))) say(join(root, 'seed/assets.json'), 1, `missing image public${a.path}`);
const listed = new Set(assets.map((a) => a.ref));
for (const m of readFileSync(join(root, 'seed/documents.json'), 'utf8').matchAll(/"_ref": "(seed-image:[^"]+)"/g))
  if (!listed.has(m[1])) say(join(root, 'seed/documents.json'), 1, `${m[1]} is not in seed/assets.json`);

if (samples.length) console.log(`note: the demo's sample legal text still in ${samples.join(', ')} (replace it and drop isSample before you publish)`);
if (placeholders.length) console.log(`note: placeholder text still in ${placeholders.join(', ')} (replace it before you publish)`);
console.log(problems.join('\n'));
console.log(`${problems.length ? 'FAIL' : 'ok'}: ${files.length} files, ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
