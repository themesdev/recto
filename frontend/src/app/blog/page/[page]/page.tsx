// /blog/page/2/ and on. Page one is /blog/.
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { BlogIndex, pageCount } from '../../../../components/BlogIndex';
import { getPage, getPostCount, getSite } from '../../../../lib/content';
import { pageMetadata } from '../../../../lib/seo';

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = pageCount(await getPostCount());
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ page: String(i + 2) }));
}

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const [doc, site] = await Promise.all([getPage('blog'), getSite()]);
  return pageMetadata({ title: `${doc?.title ?? 'Blog'}, page ${page}`, description: doc?.description ? `${doc.description} Page ${page}.` : undefined, path: `/blog/page/${page}/`, siteName: site.name, og: 'blog' });
}

export default async function BlogPage({ params }: Props) {
  const { page } = await params;
  // Page one lives at /blog/.
  if (page === '1') notFound();
  return <BlogIndex page={/^\d+$/.test(page) ? Number(page) : NaN} preview={(await draftMode()).isEnabled} />;
}
