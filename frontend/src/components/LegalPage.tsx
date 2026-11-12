// A legal page shell (privacy): page header, the text itself in the prose styles and, for the demo's sample
// texts (isSample), a notice above them that they are samples to replace. `pnpm lint` lists every page that still
// passes isSample, and every page with placeholder copy (a span of class "placeholder"), so neither goes live
// unnoticed. These pages are files, not Studio pages: legal text changes rarely and should be reviewed like code.
import type { ReactNode } from 'react';
import { PageHeader } from '../sections/items/sections/page-header/react/PageHeader';
import { container } from '../sections/recipes/section';
import { SiteLayout } from './SiteLayout';

/** isSample: the text is the demo's sample (Low Season's), not yours: shows the notice. Remove it once the text is your own. */
export function LegalPage({ title, path, updated, isSample = false, children }: { title: string; path: string; updated: string; isSample?: boolean; children: ReactNode }) {
  return (
    <SiteLayout path={path}>
      <PageHeader breadcrumb={[{ label: 'Home', href: '/' }]} heading={title} lead={`Last updated ${updated}.`} variant="stacked" />
      <div className={container('pb-(--space-section)')}>
        <div className="prose">
          {isSample && (
            <p role="note" className="rounded-card border border-border-strong bg-card p-5" data-placeholder-notice="">
              <strong>Sample text for the theme’s demo.</strong> This page is written for Low Season, an invented journal, and is not legal advice. Replace it with the text for your own product, and have that reviewed by someone qualified for your country before you publish.
            </p>
          )}
          {children}
        </div>
      </div>
    </SiteLayout>
  );
}
