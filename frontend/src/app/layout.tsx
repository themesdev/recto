// The document around every page. The page itself (announcement, header, sections, footer) is components/SiteLayout.
import '../styles/global.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { draftMode } from 'next/headers';
import { DraftTools } from '../components/DraftTools';
import { fontVariables } from '../styles/fonts';
import { siteUrl } from '../lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const preview = (await draftMode()).isEnabled;
  return (
    <html lang="en" className={fontVariables}>
      <body>
        {children}
        {preview ? <DraftTools /> : null}
      </body>
    </html>
  );
}
