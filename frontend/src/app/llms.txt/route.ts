// /llms.txt (llmstxt.org): the journal in a line, its pages, and every post as a Markdown link, for answer engines.
import { getFeed, getPage, getSite } from '../../lib/content';
import { absolute } from '../../lib/seo';

export const revalidate = 3600;

const PAGES: [slug: string, path: string][] = [['home', '/'], ['blog', '/blog/'], ['about', '/about/']];

export async function GET() {
  const [site, posts, ...pages] = await Promise.all([getSite(), getFeed(), ...PAGES.map(([slug]) => getPage(slug))]);
  const lines = [`# ${site.name}`, '', `> ${site.tagline}`, '', '## Pages', ''];
  PAGES.forEach(([, path], i) => {
    const p = pages[i];
    if (p) lines.push(`- [${p.title}](${absolute(path)})${p.description ? `: ${p.description}` : ''}`);
  });
  lines.push('', '## Essays', '', ...posts.map((p) => `- [${p.title}](${absolute(`/blog/${p.slug}.md`)})${p.excerpt ? `: ${p.excerpt}` : ''}`), '');
  lines.push('## Optional', '', `- [Privacy](${absolute('/privacy/')})`, `- [RSS feed](${absolute('/rss.xml')})`, '');
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
