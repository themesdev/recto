// The two exports of a page that the Studio builds (app/about/page.tsx and the like): its metadata and the page.
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getPage, getSite } from '../lib/content';
import { fillLatest } from '../lib/latest';
import { pageMetadata, siteJsonLd } from '../lib/seo';
import { CmsPage } from './CmsPage';

/** slug: the page document's slug in the Studio; path: where it lives on the site. */
export function cmsRoute(slug: string, path: string) {
  const isHome = path === '/';
  async function generateMetadata(): Promise<Metadata> {
    const [page, site] = await Promise.all([getPage(slug), getSite()]);
    return pageMetadata({ title: page?.title ?? site.name, description: page?.description, path, siteName: site.name, fullTitle: isHome });
  }
  async function Page() {
    const preview = (await draftMode()).isEnabled;
    const [doc, site] = await Promise.all([getPage(slug, preview), getSite(preview)]);
    const page = doc ? { ...doc, sections: await fillLatest(doc.sections, preview) } : doc;
    return <CmsPage page={page} path={path} preview={preview} jsonLd={isHome ? [siteJsonLd(site)] : []} />;
  }
  return { generateMetadata, Page };
}
