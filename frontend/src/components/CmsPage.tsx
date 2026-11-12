// A page built in the Studio: its sections, in order, with the page builder.
import { notFound } from 'next/navigation';
import { PageBuilder, type SectionBlock } from '../sections/sanity/PageBuilder';
import type { Page } from '../lib/content';
import { JsonLd } from './JsonLd';
import { SiteLayout } from './SiteLayout';

export function CmsPage({ page, path, preview, jsonLd = [] }: { page: Page | null; path: string; preview: boolean; jsonLd?: (Record<string, unknown> | string)[] }) {
  if (!page) notFound();
  return (
    <SiteLayout path={path} preview={preview}>
      {jsonLd.map((d, i) => (
        <JsonLd key={i} data={d} />
      ))}
      <PageBuilder sections={page.sections as SectionBlock[]} />
    </SiteLayout>
  );
}
