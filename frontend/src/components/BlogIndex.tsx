// One page of the blog index: the blog page's first section (its page header), the posts (the newest drawn large on
// page one, rows of three after it) with page links, then the blog page's other sections (the newsletter).
import { notFound } from 'next/navigation';
import { PageBuilder, type SectionBlock } from '../sections/sanity/PageBuilder';
import { Posts } from '../sections/items/sections/posts/react/Posts';
import { getPage, getPostCount, getPosts } from '../lib/content';
import { SiteLayout } from './SiteLayout';

/** Posts per index page: on page one the newest is drawn large above a row of three; later pages are rows of three
 *  (keep it 3n + 1). */
export const PAGE_SIZE = 4;

export const pageCount = (posts: number) => Math.max(1, Math.ceil(posts / PAGE_SIZE));

export async function BlogIndex({ page, preview }: { page: number; preview: boolean }) {
  const [doc, count] = await Promise.all([getPage('blog', preview), getPostCount(preview)]);
  const pages = pageCount(count);
  if (!doc || !Number.isInteger(page) || page < 1 || page > pages) notFound();
  const posts = await getPosts((page - 1) * PAGE_SIZE, page * PAGE_SIZE, preview);
  const [head, ...rest] = (doc.sections ?? []) as SectionBlock[];
  const first = head && page > 1 && head._type === 'pageHeaderSection' ? { ...head, heading: `${head.heading}: page ${page}` } : head;
  return (
    <SiteLayout path={page === 1 ? '/blog/' : `/blog/page/${page}/`} section="/blog/" preview={preview} title={page === 1 ? undefined : `Page ${page}`}>
      <PageBuilder sections={first ? [first] : []} />
      {posts.length ? <Posts posts={posts} trailingSlash variant={page === 1 ? 'featured' : 'grid'} pagination={{ page, pages, href: '/blog/page/{page}/', firstHref: '/blog/' }} /> : null}
      <PageBuilder sections={rest} />
    </SiteLayout>
  );
}
