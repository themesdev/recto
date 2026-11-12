// The blog's RSS feed at /rss.xml.
import { getFeed, getSite } from '../../lib/content';
import { absolute } from '../../lib/seo';

export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const [site, posts] = await Promise.all([getSite(), getFeed()]);
  const items = posts
    .map((p) => {
      const link = absolute(`/blog/${p.slug}/`);
      return `<item><title>${esc(p.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><description>${esc(p.excerpt ?? '')}</description><pubDate>${new Date(p.date).toUTCString()}</pubDate>${(p.tags ?? []).map((t) => `<category>${esc(t)}</category>`).join('')}</item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(`${site.name} blog`)}</title><description>${esc(site.tagline)}</description><link>${absolute('/')}</link><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
