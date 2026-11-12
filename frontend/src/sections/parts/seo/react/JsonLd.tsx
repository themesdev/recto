// One JSON-LD block (../json-ld.ts), the twin of JsonLd.astro. A JSON-LD script is data, not code: a
// Content-Security-Policy doesn't need to allow it. In Next.js put it in the page (a server component), not in metadata.
import { jsonLd } from '../json-ld';

export function JsonLd({ data }: { data: object | string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
