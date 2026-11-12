// A post: its head on the reading column (breadcrumb, topics, the title large, the lead, the byline), the cover a
// little wider, the body (Portable Text, drawn by the section library's rich-text part), the author, three more posts
// and the newsletter.
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '../../../sections/parts/breadcrumbs/react/Breadcrumbs';
import { Posts } from '../../../sections/items/sections/posts/react/Posts';
import { Newsletter } from '../../../sections/items/sections/newsletter/react/Newsletter';
import { formatDate } from '../../../sections/items/sections/posts/shared';
import { RichText } from '../../../sections/parts/rich-text/react/RichText';
import { container } from '../../../sections/recipes/section';
import type { NewsletterContent } from '../../../sections/items/sections/newsletter/types';
import { JsonLd } from '../../../components/JsonLd';
import { SiteLayout } from '../../../components/SiteLayout';
import { getPage, getPost, getPostSlugs, getPosts, getSite, type Post } from '../../../lib/content';
import { absolute, pageMetadata } from '../../../lib/seo';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getPostSlugs()).map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, site] = await Promise.all([getPost(slug), getSite()]);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.excerpt, path: `/blog/${slug}/`, siteName: site.name, og: `blog/${slug}`, type: 'article', published: new Date(post.date).toISOString(), markdown: `/blog/${slug}.md` });
}

/** Minutes to read the body, at 230 words a minute. */
function minutes(post: Post) {
  const words = (post.body ?? []).flatMap((b) => ('children' in b ? b.children.map((c) => c.text) : 'code' in b ? [b.code] : [])).join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const preview = (await draftMode()).isEnabled;
  const [post, site, latest, blog] = await Promise.all([getPost(slug, preview), getSite(preview), getPosts(0, 4, preview), getPage('blog', preview)]);
  if (!post) notFound();
  const more = latest.filter((p) => p.slug !== slug).slice(0, 3);
  const newsletter = blog?.sections?.find((b) => b._type === 'newsletterSection') as (NewsletterContent & { _key: string }) | undefined;
  const author = post.author;
  const url = absolute(`/blog/${slug}/`);
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    url,
    mainEntityOfPage: url,
    image: absolute(`/og/blog/${slug}.png`),
    author: author ? { '@type': 'Person', name: author.name, jobTitle: author.role ?? undefined } : undefined,
    publisher: { '@type': 'Organization', name: site.name, logo: { '@type': 'ImageObject', url: absolute('/favicon.svg') } },
    keywords: post.tags?.join(', ') || undefined,
  };
  return (
    <SiteLayout path={`/blog/${slug}/`} section="/blog/" preview={preview} title={post.title}>
      <JsonLd data={article} />
      <article>
        <header className={container('pt-(--space-section)')}>
          <div className="mx-auto max-w-(--measure)">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Essays', href: '/blog/' }, { label: post.title }]} />
            {post.tags?.length ? <p className="mt-8 text-size-sm uppercase tracking-wider">{post.tags.join(' · ')}</p> : null}
            <h1 className="mt-4 font-heading text-size-2xl text-balance sm:text-size-display">{post.title}</h1>
            {post.excerpt ? <p className="mt-6 text-size-lg text-pretty text-muted-foreground">{post.excerpt}</p> : null}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-5 text-size-sm text-muted-foreground">
              {author ? (
                <span className="flex items-center gap-3">
                  {author.avatar ? <img src={author.avatar.src} alt="" width={36} height={36} className="size-9 rounded-full" /> : null}
                  <span>
                    <span className="font-medium text-foreground">{author.name}</span>
                    {author.role ? `, ${author.role}` : null}
                  </span>
                </span>
              ) : null}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{minutes(post)} min read</span>
            </div>
          </div>
        </header>
        <div className={container('pb-(--space-section)')}>
          {post.image ? <img src={post.image.src} alt={post.image.alt} width={post.image.width} height={post.image.height} className="mx-auto mt-(--space-section) w-full max-w-5xl rounded-card border border-border" fetchPriority="high" /> : null}
          <RichText value={post.body} className="mx-auto mt-(--space-section)" />
          {author ? (
            <aside aria-label="About the author" className="mx-auto mt-(--space-section) flex max-w-(--measure) gap-5 rounded-card border border-border bg-card p-6">
              {author.avatar ? <img src={author.avatar.src} alt="" width={64} height={64} className="size-16 shrink-0 rounded-full" loading="lazy" /> : null}
              <div>
                <p className="font-heading text-size-lg text-foreground">{author.name}</p>
                {author.role ? <p className="text-size-sm text-muted-foreground">{author.role}</p> : null}
                {author.bio ? <p className="mt-2 text-muted-foreground">{author.bio}</p> : null}
              </div>
            </aside>
          ) : null}
        </div>
      </article>
      {more.length ? <Posts trailingSlash heading="More essays" link={{ label: 'All essays', href: '/blog/' }} posts={more} variant="grid" tone="muted" /> : null}
      {newsletter ? <Newsletter {...newsletter} variant="card" tone="default" /> : null}
    </SiteLayout>
  );
}
