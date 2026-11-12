// Every post as Markdown, served at /blog/<slug>.md (a rewrite in next.config.ts), for answer engines.
import { getPost, getPostSlugs } from '../../../lib/content';
import { toMarkdown } from '../../../lib/markdown';
import { absolute } from '../../../lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getPostSlugs()).map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return new Response('Not found', { status: 404 });
  const head = `# ${post.title}\n\n${post.excerpt ? `> ${post.excerpt}\n\n` : ''}${post.author?.name ? `${post.author.name}, ` : ''}${post.date.slice(0, 10)} · ${absolute(`/blog/${slug}/`)}\n\n`;
  return new Response(`${head}${toMarkdown(post.body)}\n`, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
