// Every page: the announcement bar, the site header, the page's sections in <main id="main"> (the header's skip link
// goes there) and the footer, all from the Site document.
import type { ReactNode } from 'react';
import { Announcement } from '../sections/items/sections/announcement/react/Announcement';
import { Header } from '../sections/items/sections/header/react/Header';
import { Footer } from '../sections/items/sections/footer/react/Footer';
import { getSite } from '../lib/content';
import { breadcrumbJsonLd } from '../lib/seo';
import { JsonLd } from './JsonLd';

interface Props {
  /** This page's address (/about/): the header marks the matching link as the current page. */
  path: string;
  /** Which navigation link is current when it isn't this address (/blog/ for a post). */
  section?: string;
  preview?: boolean;
  /** The page's title, for its BreadcrumbList when it is nested (/blog/<post>/). */
  title?: string;
  children: ReactNode;
}

export async function SiteLayout({ path, section, preview = false, title, children }: Props) {
  const site = await getSite(preview);
  const crumbs = title ? breadcrumbJsonLd(path, title) : null;
  return (
    <>
      {site.announcement?.text ? <Announcement {...site.announcement} /> : null}
      <Header {...site.header} currentPath={section ?? path} />
      {crumbs ? <JsonLd data={crumbs} /> : null}
      <main id="main">{children}</main>
      <Footer {...site.footer} />
    </>
  );
}
