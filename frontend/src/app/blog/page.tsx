import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { BlogIndex } from '../../components/BlogIndex';
import { getPage, getSite } from '../../lib/content';
import { pageMetadata } from '../../lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [page, site] = await Promise.all([getPage('blog'), getSite()]);
  return pageMetadata({ title: page?.title ?? 'Blog', description: page?.description, path: '/blog/', siteName: site.name, og: 'blog' });
}

export default async function Blog() {
  return <BlogIndex page={1} preview={(await draftMode()).isEnabled} />;
}
