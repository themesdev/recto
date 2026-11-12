// /og/<page>.png for every page and post: the image social networks show when a page is shared.
import { getPage, getPost, getPostSlugs, getSite } from '../../../lib/content';
import { ogImage } from '../../../lib/og/image';
import { siteUrl } from '../../../lib/seo';

export const revalidate = 3600;

/** The pages with an image of their own: the page document's slug, its heading's eyebrow. */
const PAGES: Record<string, { slug?: string; eyebrow: string; title?: string; description?: string }> = {
  home: { slug: 'home', eyebrow: 'Home' },
  about: { slug: 'about', eyebrow: 'About' },
  blog: { slug: 'blog', eyebrow: 'Essays' },
  privacy: { eyebrow: 'Privacy', title: 'Privacy', description: 'What we do with your email address, and what we do not do.' },
};

export async function generateStaticParams() {
  const posts = await getPostSlugs();
  return [...Object.keys(PAGES).map((k) => ({ key: [`${k}.png`] })), ...posts.map((p) => ({ key: ['blog', `${p.slug}.png`] }))];
}

/** The heading a page opens with (its hero or page header), else its title. */
function heading(sections: { _type: string; heading?: string | null }[] | null | undefined) {
  return sections?.find((s) => s._type === 'heroSection' || s._type === 'pageHeaderSection')?.heading ?? null;
}

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join('/').replace(/\.png$/, '');
  const site = await getSite();
  const host = new URL(siteUrl).host;
  let props: { title: string; description: string; eyebrow: string } | null = null;
  if (key.startsWith('blog/')) {
    const post = await getPost(key.slice(5));
    if (post) props = { title: post.title, description: post.excerpt ?? '', eyebrow: post.tags?.[0] ?? 'Blog' };
  } else if (PAGES[key]) {
    const p = PAGES[key];
    const page = p.slug ? await getPage(p.slug) : null;
    props = { title: p.title ?? heading(page?.sections) ?? page?.title ?? site.name, description: p.description ?? page?.description ?? site.tagline, eyebrow: p.eyebrow };
  }
  if (!props) return new Response('Not found', { status: 404 });
  return ogImage({ ...props, siteName: site.name, host });
}
