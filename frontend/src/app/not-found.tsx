// The 404 page: every unknown address, and a page or post that doesn't exist (notFound()).
import type { Metadata } from 'next';
import { PageHeader } from '../sections/items/sections/page-header/react/PageHeader';
import { container } from '../sections/recipes/section';
import { action } from '../sections/recipes/action';
import { SiteLayout } from '../components/SiteLayout';
import { getSite } from '../lib/content';
import { pageMetadata } from '../lib/seo';

const links = [
  { label: 'Home', href: '/', text: 'The newest essays, and what Low Season is about.' },
  { label: 'Essays', href: '/blog/', text: 'Everything we have published, newest first.' },
  { label: 'About', href: '/about/', text: 'Who writes Low Season, and why.' },
  { label: 'RSS feed', href: '/rss.xml', text: 'Follow the journal in your feed reader.' },
];

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata({ title: 'Page not found', description: "This page doesn't exist, or it has moved. One of these links will probably help.", path: '/404/', siteName: site.name, og: 'home', noindex: true });
}

export default function NotFound() {
  return (
    <SiteLayout path="/404/">
      <PageHeader eyebrow="404" heading="This page isn’t here" lead="The address may be mistyped, or the page has moved. One of these will probably help." variant="centered" />
      <div className={container('pb-(--space-section)')}>
        <ul role="list" className="mx-auto grid max-w-3xl gap-(--space-gap) sm:grid-cols-2">
          {links.map((l) => (
            <li key={l.href} className="rounded-card border border-border bg-card p-6">
              <a href={l.href} className="font-heading text-size-lg text-foreground underline-offset-4 hover:underline">
                {l.label}
              </a>
              <p className="mt-1 text-muted-foreground">{l.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-(--space-gap) text-center">
          <a href="/" className={action({ emphasis: 'primary' })}>
            Back to the home page
          </a>
        </p>
      </div>
    </SiteLayout>
  );
}
