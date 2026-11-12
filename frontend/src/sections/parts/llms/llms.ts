// What answer engines read (seo-llms, seo-markdown): /llms.txt (llmstxt.org), /llms-full.txt, and a Markdown version
// of every long-form page (docs, posts, releases, cases) linked from its head. Framework-free: an Astro endpoint and a
// Next route handler both return markdownResponse(…) / textResponse(…).
//   llmsTxt({ name, summary, site, sections })   # Name, > summary, ## sections of links (.md where there is one)
//   llmsFullTxt({ name, summary, pages })         every long-form page in full, one file (the kit asks for it when
//                                                 the long-form pages hold more than 50,000 characters)
//   longformMarkdown({ title, summary, … })       one page's .md, starting with its # title
//   markdownPath('/journal/grids/')              /journal/grids.md (Next: a rewrite to a route handler)
//   MarkdownAlternate.astro / react/MarkdownAlternate.tsx, or markdownAlternates() in Next metadata: the
//   <link rel="alternate" type="text/markdown"> in the page head
import { absoluteUrl, type SiteUrl } from '../seo/json-ld';

/** Above this many characters of long-form text, the kit wants /llms-full.txt (its seo.llmsFull default). */
export const LLMS_FULL_THRESHOLD = 50000;

/** The .md address of a page: /journal/grids/ → /journal/grids.md, / → /index.md. */
export const markdownPath = (path: string) => `${path.replace(/\/+$/, '') || '/index'}.md`;

/** For Next metadata: alternates: { types: markdownAlternates('/journal/grids/', siteUrl) }. */
export const markdownAlternates = (path: string, site: SiteUrl) => ({ 'text/markdown': absoluteUrl(markdownPath(path), site) });

export interface LlmsLink {
  title: string;
  /** A path or URL: the .md version for long-form pages (markdownPath), the page for the rest. */
  href: string;
  description?: string | null;
}

export interface LlmsSection {
  /** Pages, Docs, Journal, Case studies … "Optional" is the llmstxt.org name for what a reader may skip. */
  title: string;
  links: LlmsLink[];
}

export interface LlmsSite {
  name: string;
  site: SiteUrl;
  /** One line: what the site is (the > line). */
  summary?: string | null;
  /** A paragraph or two after the summary. */
  details?: string | null;
  sections: LlmsSection[];
  /** Link /llms-full.txt under Optional (default true). */
  full?: boolean;
}

const oneLine = (s?: string | null) => (s ?? '').replace(/\s+/g, ' ').trim();

/** /llms.txt: # Name, > summary, details, then a ## heading and a list of links per section. */
export function llmsTxt({ name, site, summary, details, sections, full = true }: LlmsSite) {
  const lines = [`# ${oneLine(name)}`, ''];
  if (summary) lines.push(`> ${oneLine(summary)}`, '');
  if (details) lines.push(details.trim(), '');
  const all = sections.map((s) => ({ ...s, links: [...s.links] }));
  if (full) {
    const optional = all.find((s) => s.title === 'Optional') ?? (all.push({ title: 'Optional', links: [] }), all.at(-1)!);
    optional.links.unshift({ title: 'Everything above in one file', href: '/llms-full.txt' });
  }
  for (const s of all.filter((s) => s.links.length)) {
    lines.push(`## ${oneLine(s.title)}`, '');
    for (const l of s.links) lines.push(`- [${oneLine(l.title)}](${absoluteUrl(l.href, site)})${l.description ? `: ${oneLine(l.description)}` : ''}`);
    lines.push('');
  }
  return lines.join('\n');
}

export interface LongformPage {
  /** The page's h1. */
  title: string;
  /** Its lead or excerpt (the > line). */
  summary?: string | null;
  /** A line about the page: who and when (Maren Holt, 2026-10-28), or Case study by Corvel, 2025. */
  byline?: string | null;
  /** The page's path, named after the byline so a reader can find the page. */
  path?: string | null;
  site?: SiteUrl | null;
  /** Label: value lines before the body (a case's client, year, services). */
  facts?: { label: string; value: string }[] | null;
  /** The body, already Markdown (portableTextToMarkdown, mdxToMarkdown). */
  body: string;
  /** More Markdown after the body (## Outcomes, a quote). */
  after?: string | null;
}

/** One long-form page as Markdown, starting with its # title. */
export function longformMarkdown({ title, summary, byline, path, site, facts, body, after }: LongformPage) {
  const lines = [`# ${oneLine(title)}`, ''];
  if (summary) lines.push(`> ${oneLine(summary)}`, '');
  const url = path && site ? absoluteUrl(path, site) : null;
  if (byline || url) lines.push([byline, url].filter(Boolean).join(' · '), '');
  if (facts?.length) lines.push(...facts.map((f) => `- ${f.label}: ${f.value}`), '');
  lines.push(body.trim(), '');
  if (after) lines.push(after.trim(), '');
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

/** /llms-full.txt: the site's # Name and > summary, then every page's Markdown, separated by rules. */
export function llmsFullTxt({ name, summary, pages }: { name: string; summary?: string | null; pages: string[] }) {
  const head = `# ${oneLine(name)}\n${summary ? `\n> ${oneLine(summary)}\n` : ''}`;
  return [head, ...pages.filter((p) => p.trim())].join('\n\n---\n\n');
}

/** Does the site need /llms-full.txt? (the long-form pages' Markdown together over LLMS_FULL_THRESHOLD characters) */
export const needsLlmsFull = (pages: string[], threshold = LLMS_FULL_THRESHOLD) => pages.reduce((n, p) => n + p.length, 0) > threshold;

const respond = (body: string, type: string) => new Response(body, { headers: { 'content-type': `${type}; charset=utf-8` } });
/** /llms.txt and /llms-full.txt. */
export const textResponse = (body: string) => respond(body, 'text/plain');
/** A page's .md version. */
export const markdownResponse = (body: string) => respond(body, 'text/markdown');
