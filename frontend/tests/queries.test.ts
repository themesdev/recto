// The GROQ queries the site runs, proven against the demo content (seed/) with groq-js, Sanity's query engine:
// every page comes back with its sections in the shape their React components take, images resolved to
// { src, alt, width, height }, posts with bodies and authors, and the Site document.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { evaluate, parse } from 'groq-js';
import { feedQuery, pageQuery, postCountQuery, postListQuery, postQuery, postSlugsQuery, siteQuery } from '../src/lib/queries.ts';

const read = (f: string) => JSON.parse(readFileSync(new URL(`../seed/${f}`, import.meta.url), 'utf8'));
const assets = read('assets.json') as { ref: string; path: string; width: number; height: number }[];
const dataset = [...read('documents.json'), ...assets.map((a) => ({ _id: a.ref, _type: 'sanity.imageAsset', url: a.path, metadata: { dimensions: { width: a.width, height: a.height } } }))];
const run = async (q: string, params: Record<string, unknown> = {}) => (await evaluate(parse(q, { params }), { dataset, params })).get();

/** Every object that looks like an image (has src) must be complete; every link must have label and href. */
function checkShapes(value: unknown, path: string, problems: string[]) {
  if (Array.isArray(value)) return value.forEach((v, i) => checkShapes(v, `${path}[${i}]`, problems));
  if (!value || typeof value !== 'object') return;
  const o = value as Record<string, unknown>;
  if ('src' in o) {
    if (typeof o.src !== 'string' || !o.src.startsWith('/images/') && o.src !== '/favicon.svg') problems.push(`${path}.src ${o.src}`);
    if (!(Number(o.width) > 0 && Number(o.height) > 0)) problems.push(`${path}: no size`);
    if (typeof o.alt !== 'string') problems.push(`${path}: no alt`);
  }
  if (o.href && 'label' in o && !o.label) problems.push(`${path}: link without a label`);
  for (const [k, v] of Object.entries(o)) checkShapes(v, `${path}.${k}`, problems);
}

const PAGES = {
  home: ['heroSection', 'postsSection', 'postsSection', 'newsletterSection'],
  blog: ['pageHeaderSection', 'newsletterSection'],
  about: ['pageHeaderSection', 'contentSection', 'teamSection', 'newsletterSection'],
};

for (const [slug, types] of Object.entries(PAGES))
  test(`pageQuery: ${slug}`, async () => {
    const page = await run(pageQuery, { slug });
    assert.ok(page, `no page ${slug}`);
    assert.equal(page.slug, slug);
    assert.ok(page.title && page.description);
    assert.deepEqual(page.sections.map((s: { _type: string }) => s._type), types);
    for (const s of page.sections) {
      assert.ok(s._key && s.variant, `${slug} ${s._type}: key and variant`);
      assert.ok(!('anchor' in s), 'the anchor comes back as id');
    }
    const problems: string[] = [];
    checkShapes(page.sections, slug, problems);
    assert.deepEqual(problems, []);
  });

test('pageQuery: anchors become ids', async () => {
  const ids = async (slug: string) => (await run(pageQuery, { slug })).sections.map((s: { id: string | null }) => s.id).filter(Boolean);
  assert.deepEqual(await ids('home'), ['newsletter']);
  assert.deepEqual(await ids('blog'), ['newsletter']);
  assert.deepEqual(await ids('about'), ['newsletter']);
});

test('pageQuery: the newsletter posts to the route handler', async () => {
  const blog = await run(pageQuery, { slug: 'blog' });
  assert.equal(blog.sections.find((s: { _type: string }) => s._type === 'newsletterSection').action, '/api/newsletter/');
});

test('siteQuery: announcement, header, footer and organisation', async () => {
  const site = await run(siteQuery);
  assert.equal(site.header.brand.name, 'Low Season');
  assert.ok(site.header.links.length === 3 && site.header.actions.length === 1);
  assert.ok(site.footer.columns.length === 2 && site.footer.brand.tagline);
  assert.ok(site.announcement.text);
  // No profiles on real platforms in the demo (a handle there could be claimed by anyone): only the feed.
  assert.deepEqual(site.footer.social.map((s: { url: string }) => s.url), ['/rss.xml']);
  assert.equal(site.organisation.email, 'letters@lowseason.example');
});

test('postListQuery and postCountQuery: newest first, paginated', async () => {
  assert.equal(await run(postCountQuery), 8);
  const first = await run(postListQuery, { start: 0, end: 4 });
  const second = await run(postListQuery, { start: 4, end: 8 });
  assert.equal(first.length, 4);
  assert.equal(second.length, 4);
  const dates = [...first, ...second].map((p: { date: string }) => p.date);
  assert.deepEqual(dates, [...dates].sort().reverse());
  for (const p of first) {
    assert.ok(p.slug && p.title && p.excerpt && p.image?.src && p.author?.name && p.author.avatar?.src);
    assert.ok(!('body' in p), 'cards carry no body');
  }
});

test('postQuery: a whole post with body, author role and bio', async () => {
  for (const { slug } of await run(postSlugsQuery)) {
    const post = await run(postQuery, { slug });
    assert.equal(post.slug, slug);
    assert.ok(post.author.role && post.author.bio, `${slug}: author role and bio`);
    assert.ok(post.body.length > 5, `${slug}: body`);
    for (const b of post.body) assert.ok(['block', 'image', 'sectionCode', 'sectionTable'].includes(b._type), `${slug}: ${b._type}`);
    const problems: string[] = [];
    checkShapes(post, slug, problems);
    assert.deepEqual(problems, []);
  }
  // A code fence's title comes through as the block's file name; a Markdown table as a table block, header row first.
  const changelog = await run(postQuery, { slug: 'writing-a-changelog-people-read' });
  assert.ok(changelog.body.some((b: { _type: string; filename?: string }) => b._type === 'sectionCode' && b.filename === 'appointments-2026-09.csv'));
  const sharpening = await run(postQuery, { slug: 'sharpening-a-ten-minute-habit' });
  const table = sharpening.body.find((b: { _type: string }) => b._type === 'sectionTable');
  assert.deepEqual(table?.rows.map((r: { cells: string[] }) => r.cells.length), [3, 3, 3, 3]);
  assert.deepEqual(table?.rows[0].cells, ['Step', 'What I use', 'Time']);
  assert.equal(await run(postQuery, { slug: 'no-such-post' }), null);
});

test('feedQuery: every post', async () => {
  assert.equal((await run(feedQuery)).length, 8);
});
