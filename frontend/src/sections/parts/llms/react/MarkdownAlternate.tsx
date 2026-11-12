// The link from a long-form page to its Markdown version (../llms.ts), the twin of MarkdownAlternate.astro. React 19
// moves a <link> into the head wherever it renders. In Next.js metadata, alternates.types: markdownAlternates(path,
// site) does the same.
import { absoluteUrl, type SiteUrl } from '../../seo/json-ld';
import { markdownPath } from '../llms';

export function MarkdownAlternate({ path, site, href }: { path: string; site: SiteUrl; href?: string | null }) {
  return <link rel="alternate" type="text/markdown" href={absoluteUrl(href ?? markdownPath(path), site)} />;
}
