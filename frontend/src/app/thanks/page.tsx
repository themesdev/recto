// Where the newsletter form sends people after a successful post (the form handler in app/api/newsletter does).
import type { Metadata } from 'next';
import { PageHeader } from '../../sections/items/sections/page-header/react/PageHeader';
import { Cta } from '../../sections/items/sections/cta/react/Cta';
import { SiteLayout } from '../../components/SiteLayout';
import { getSite } from '../../lib/content';
import { pageMetadata } from '../../lib/seo';

// The header and footer come from the Site document: rebuilt in the background at most once a minute.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata({ title: 'Thank you', description: 'Check your inbox to confirm your address. The next essay arrives on a Wednesday.', path: '/thanks/', siteName: site.name, og: 'home', noindex: true });
}

export default function Thanks() {
  return (
    <SiteLayout path="/thanks/">
      <PageHeader eyebrow="Subscribed" heading="Thank you, almost done" lead="We have sent you an email to confirm your address. Once you click the link in it, the next essay arrives on a Wednesday." variant="centered" />
      <Cta heading="While you wait" lead="Every essay we have published is in the archive, newest first." actions={[{ label: 'Read the essays', href: '/blog/', emphasis: 'primary' }, { label: 'Back to home', href: '/', emphasis: 'secondary' }]} variant="row" tone="muted" />
    </SiteLayout>
  );
}
