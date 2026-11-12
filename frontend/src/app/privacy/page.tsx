import type { Metadata } from 'next';
import { LegalPage } from '../../components/LegalPage';
import { getSite } from '../../lib/content';
import { pageMetadata } from '../../lib/seo';

// The header and footer come from the Site document: rebuilt in the background at most once a minute.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return pageMetadata({ title: 'Privacy', description: 'What Low Season does with your email address, and what it does not do. Sample text for the template’s demo.', path: '/privacy/', siteName: site.name });
}

export default function Privacy() {
  return (
    <LegalPage isSample title="Privacy" path="/privacy/" updated="1 November 2026">
    <p>Low Season is a small journal. This page explains the little personal data it handles: your email address if you subscribe, and the technical data any website sees. If something here is unclear, write to us.</p>
    <h2>Who is responsible</h2>
    <p>Low Season, run by its three writers, is responsible for the data described here. You can reach us at <a href="mailto:letters@lowseason.example">letters@lowseason.example</a>.</p>
    <h2>The newsletter</h2>
    <p>When you subscribe, we keep your email address to send you new essays, about twice a month. We use it for nothing else and never share or sell it. Every email has a link to unsubscribe. Legal basis: your consent, which you can withdraw at any time.</p>
    <p>Our emails contain no tracking pixels and no tracked links, so we do not know whether you opened them.</p>
    <h2>When you write to us</h2>
    <p>Replies to the newsletter and letters to our address reach the three of us. We keep them for as long as the conversation is useful, and at most two years. If we would like to quote you in an essay, we ask first.</p>
    <h2>Visiting this website</h2>
    <p>This website uses no cookies for analytics or advertising and loads no third-party trackers. Our host keeps short-lived technical logs (IP address, browser, time of the request) to keep the site running and secure; they are deleted within 30 days.</p>
    <p>If you close the announcement at the top of the page, your browser remembers that in its local storage. It is never sent to us.</p>
    <h2>Who helps us</h2>
    <ul>
      <li>a hosting provider, for this website;</li>
      <li>an email delivery service, for the newsletter;</li>
      <li>a content system, where we write and store the essays (it holds no reader data).</li>
    </ul>
    <h2>Your rights</h2>
    <p>You can ask us which data we hold about you, and ask us to correct or delete it. Write to <a href="mailto:letters@lowseason.example">letters@lowseason.example</a> and we will answer within a month. You also have the right to complain to a data protection authority.</p>
    <h2>Changes</h2>
    <p>When this page changes, the date at the top changes with it. If a change matters for how we use your address, we tell subscribers in the next newsletter.</p>
    </LegalPage>
  );
}
