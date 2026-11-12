// Structured data (schema.org) as JSON-LD. "<" is escaped so a value can't close the script tag. A JSON-LD script is
// data, not code: a Content-Security-Policy doesn't need to allow it.
export function JsonLd({ data }: { data: Record<string, unknown> | string }) {
  const json = (typeof data === 'string' ? data : JSON.stringify(data)).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
