// The demo drawings, in the colours of the active preset (src/styles/global.css), with its dark mode built in: an SVG
// shown with <img> follows the reader's light or dark setting through its own @media (prefers-color-scheme) rule.
//   public/images/posts/    blog covers (one per post, by file name)
//   public/images/people/   faceless avatars
//   public/favicon.svg      the brand mark
// They are placeholders: replace them with your own screenshots and photos. Run again after switching presets, before
// `pnpm seed` (the seed uploads these files to Sanity):
//   pnpm draw-demo
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { presetPalette } from './palette.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pal = presetPalette(undefined, root);
const KEYS = ['background', 'card', 'border', 'border-strong', 'foreground', 'muted-foreground', 'primary', 'primary-foreground', 'primary-soft', 'primary-soft-foreground'];
const radius = Math.min(parseFloat(pal.light['radius-card'] ?? '4'), 16);
const mono = pal.light['font-mono'] ?? 'ui-monospace, monospace';
const sans = pal.light['font-sans'] ?? 'system-ui, sans-serif';

const vars = (p) => KEYS.map((k) => `--${k}:${p[k]}`).join(';');
const style = () => {
  const cls = KEYS.map((k) => `.f-${k}{fill:var(--${k})}.s-${k}{stroke:var(--${k})}`).join('');
  const dark = pal.dark ? `@media (prefers-color-scheme: dark){svg{${vars(pal.dark)}}}` : '';
  return `<style>svg{${vars(pal.light)}}${dark}${cls}text{font-family:${sans.replace(/"/g, "'")}}.mono{font-family:${mono.replace(/"/g, "'")}}</style>`;
};
const svg = (w, h, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${label ? ` role="img" aria-label="${label}"` : ''}>${style()}\n${body}\n</svg>\n`;
const rect = (x, y, w, h, fill, r = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="f-${fill}"${extra}/>`;
const text = (x, y, s, size, fill = 'foreground', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" class="f-${fill}${extra.includes('mono') ? ' mono' : ''}"${extra.replace('mono', '')}>${s}</text>`;

// Blog covers: a line drawing per post, in ink on the page colour with one touch of the accent, keyed by the post's
// file name (a post without its own drawing gets the notebook). Line work only, so they sit quietly beside the text.
const ink = (d, w = 9, cls = 'foreground', extra = '') => `<path d="${d}" fill="none" class="s-${cls}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const dot = (cx, cy, r, f = 'primary') => `<circle cx="${cx}" cy="${cy}" r="${r}" class="f-${f}"/>`;
const ring = (cx, cy, r, cls = 'foreground', w = 8) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" class="s-${cls}" stroke-width="${w}"/>`;
const ground = (y = 760) => ink(`M120 ${y}H1480`, 4, 'border-strong');
const bars = (x, y, widths, gap = 34, f = 'muted-foreground', o = 0.35) => widths.map((w, i) => rect(x, y + i * gap, w, 10, f, 5, ` opacity="${o}"`)).join('');

const COVERS = {
  // A kitchen chair in side view: seat, front leg, the back leg running up into the raked back, a stretcher; the
  // mended joint ringed in the accent.
  'fixing-the-same-chair-three-times': () =>
    ground(790) +
    ink('M540 470H960', 16) + // the seat, end-on
    ink('M575 478L590 790', 14) + // front leg
    ink('M930 790L950 478L1035 120', 14) + // back leg into the back post
    ink('M995 290L1060 300M975 375L1040 385', 10) + // back rails, end-on
    ink('M585 660H940', 8) + // stretcher
    ring(950, 470, 66, 'primary', 9),
  // A page of candidate names: most crossed out, one kept.
  'a-field-guide-to-naming-things': (r) => {
    let b = rect(470, 110, 660, 680, 'card', radius) + `<rect x="470.5" y="110.5" width="659" height="679" rx="${radius}" fill="none" class="s-border"/>`;
    for (let i = 0; i < 14; i++) {
      const y = 170 + i * 44;
      const w = 180 + Math.round(r() * 260);
      const kept = i === 9;
      b += rect(540, y, w, 12, kept ? 'primary' : 'foreground', 6, kept ? '' : ' opacity="0.55"');
      if (!kept && r() > 0.25) b += ink(`M528 ${y + 6}H${552 + w}`, 7, 'foreground');
    }
    return b + ink('M520 562H1080', 5, 'primary');
  },
  // The working day as a line, with three windows when the mail is read: 09:00, 13:00, 16:00.
  'the-case-for-a-slower-inbox': () => {
    const x = (h) => 200 + ((h - 7) / 12) * 1200;
    let b = ink(`M${x(7)} 640H${x(19)}`, 7);
    for (let h = 7; h <= 19; h++) b += ink(`M${x(h)} 628V652`, 5, 'border-strong');
    [9, 13, 16].forEach((h, i) => {
      b += dot(x(h), 640, 14);
      for (let k = 0; k < 4 + i; k++) {
        const y = 560 - k * 46;
        b += rect(x(h) - 70, y, 140, 34, 'card', radius) + `<rect x="${x(h) - 69.5}" y="${y + 0.5}" width="139" height="33" rx="${radius}" fill="none" class="s-foreground" stroke-width="5"/>` + ink(`M${x(h) - 70} ${y}L${x(h)} ${y + 20}L${x(h) + 70} ${y}`, 5);
      }
    });
    return b;
  },
  // An open notebook: ruled pages, a sketch on the right, the ribbon in the accent.
  'what-a-paper-notebook-knows': () => {
    let b = ink('M800 190C700 170 560 170 330 200V740C560 710 700 710 800 730C900 710 1040 710 1270 740V200C1040 170 900 170 800 190Z', 9) + ink('M800 190V730', 7);
    for (let i = 0; i < 11; i++) b += ink(`M380 ${270 + i * 40}H750`, 4, 'border-strong');
    b += bars(390, 255, [300, 240, 330, 180, 280], 40, 'foreground', 0.5);
    b += ink('M880 600L940 420L1060 420L1180 600Z', 7) + ink('M940 420L1000 340L1060 420', 7) + ring(1000, 520, 34, 'foreground', 7);
    b += ink('M800 730C810 780 790 810 812 850', 10, 'primary');
    return b + text(560, 700, '41', 22, 'muted-foreground', ' text-anchor="middle"') + text(1040, 700, '42', 22, 'muted-foreground', ' text-anchor="middle"');
  },
  // A changelog as a column of releases, the headline one in the accent.
  'writing-a-changelog-people-read': () => {
    let b = ink('M520 150V780', 7, 'border-strong');
    [[0, 420, true], [1, 300], [2, 360], [3, 250], [4, 320]].forEach(([i, w, head]) => {
      const y = 190 + i * 130;
      b += head ? dot(520, y, 16) : ring(520, y, 12, 'foreground', 7);
      b += rect(580, y - 22, head ? w + 140 : w, head ? 22 : 14, head ? 'foreground' : 'foreground', 7, head ? '' : ' opacity="0.6"');
      b += bars(580, y + 18, [w + 60, w - 40], 26);
    });
    return b;
  },
  // A tall window in winter: a low sun and the patch of light it throws on the floor.
  'the-studio-in-winter-light': () =>
    ground(720) +
    `<path d="M560 720L760 720L1180 860L900 860Z" class="f-primary-soft"/>` +
    ink('M560 150H760V600H560Z', 9) + ink('M660 150V600M560 300H760M560 450H760', 7) +
    dot(1200, 330, 64) + ink('M1060 330H1110M1290 330H1340', 5, 'primary'),
  // Two short lists in place of a board: what we are working on, and what we decided not to do.
  'why-we-stopped-keeping-a-roadmap': () => {
    let b = text(380, 230, 'Working on', 30, 'foreground') + text(900, 230, 'Not doing', 30, 'foreground');
    b += ink('M380 260H700M900 260H1220', 5, 'border-strong');
    [0, 1, 2].forEach((i) => (b += dot(392, 312 + i * 64, 9) + rect(420, 306 + i * 64, 230 - i * 40, 12, 'foreground', 6, ' opacity="0.7"')));
    for (let i = 0; i < 7; i++) b += ring(912, 312 + i * 64, 9, 'foreground', 6) + rect(940, 306 + i * 64, 260 - ((i * 37) % 120), 12, 'foreground', 6, ' opacity="0.45"');
    return b;
  },
  // A chisel on a sharpening stone, the fresh edge in the accent.
  'sharpening-a-ten-minute-habit': () =>
    rect(360, 610, 880, 90, 'card', radius) + `<rect x="360.5" y="610.5" width="879" height="89" rx="${radius}" fill="none" class="s-foreground" stroke-width="7"/>` +
    ink('M420 655H1180', 4, 'border-strong', ' stroke-dasharray="4 10"') +
    ink('M720 610L1180 250L1230 300L790 610Z', 9) + // the blade
    ink('M1180 250L1290 165L1350 225L1230 300', 9) + // handle start
    ink('M1290 165L1380 95L1440 155L1350 225', 9) +
    ink('M720 610H790', 7, 'primary'),
};
const cover = (slug) =>
  svg(1600, 900, rect(0, 0, 1600, 900, 'background') + `<g transform="translate(800 450) scale(1.18) translate(-800 -450)">${(COVERS[slug] ?? COVERS['what-a-paper-notebook-knows'])(rand(slug))}</g>`);
const rand = (seed) => {
  let s = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
};

// Avatars: monogram tiles, the person's initials on a soft ground in turns of the preset's accents. The names come from
// the demo content (seed/documents.json), so a tile always matches the name beside it; a number with no name
// gets the tile without letters.
const AV = [['primary-soft', 'primary-soft-foreground'], ['primary', 'primary-foreground'], ['border', 'foreground'], ['foreground', 'background']];
const SEED = JSON.parse(readFileSync(join(root, 'seed/documents.json'), 'utf8'));
const NAMES = (() => {
  // Every object in the seed with a name and a person-<n> avatar (testimonials, authors, team).
  const map = {};
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (!o || typeof o !== 'object') return;
    const n = JSON.stringify(o.avatar ?? o.image ?? '').match(/person-(\d+)/)?.[1];
    if (n && typeof o.name === 'string') map[n] ??= o.name;
    Object.values(o).forEach(walk);
  };
  walk(SEED);
  return map;
})();
const initialsOf = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const avatar = (n) => {
  const [g, f] = AV[n % AV.length];
  const name = NAMES[n];
  const mark = name
    ? text(48, 60, initialsOf(name), 34, f, ' text-anchor="middle" font-weight="600" letter-spacing="-1"')
    : `<rect x="34" y="34" width="28" height="28" class="f-${f}"/>`;
  return svg(96, 96, `${rect(0, 0, 96, 96, g)}${mark}`);
};

// The brand mark: a right-hand page (recto) with its fold, on the accent.
const favicon = () =>
  svg(64, 64, `${rect(0, 0, 64, 64, 'primary', Math.min(radius * 2, 14))}<path d="M20 14h18l8 8v28H20z" class="f-primary-foreground"/><path d="M38 14v8h8" fill="none" class="s-primary" stroke-width="3"/><path d="M26 32h14M26 39h14M26 46h9" class="s-primary" stroke-width="3"/>`);

const out = (p, s) => {
  mkdirSync(dirname(join(root, 'public', p)), { recursive: true });
  writeFileSync(join(root, 'public', p), s);
};
const posts = SEED.filter((d) => d._type === 'post').map((d) => d.slug.current);
for (const slug of posts) out(`images/posts/${slug}.svg`, cover(slug));
for (const n of Object.keys(NAMES).map(Number)) out(`images/people/person-${n}.svg`, avatar(n));
out('favicon.svg', favicon());
console.log(`draw-demo: preset ${pal.name} (${pal.modes.join('+')}): ${posts.length} covers, ${Object.keys(NAMES).length} avatars, favicon`);
