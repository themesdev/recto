// DEMO AND QA ONLY. With no Sanity project set (NEXT_PUBLIC_SANITY_PROJECT_ID empty), `pnpm dev` and the theme's own
// checks read the demo content from seed/ instead of the Content Lake: the very documents `pnpm seed` imports, queried
// with the same GROQ by groq-js (Sanity's own query engine in JavaScript). Each image becomes an asset document whose
// url is the file in public/. A production build refuses to use this unless SANITY_FIXTURE=1 is set (./index.ts).
import 'server-only';
import { evaluate, parse } from 'groq-js';
import documents from '../../../seed/documents.json';
import assets from '../../../seed/assets.json';

const dataset = [
  ...(documents as unknown as Record<string, unknown>[]),
  ...assets.map((a) => ({
    _id: a.ref,
    _type: 'sanity.imageAsset',
    url: a.path,
    metadata: { dimensions: { width: a.width, height: a.height, aspectRatio: a.width / a.height } },
  })),
];

export async function fixtureQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const tree = parse(query, { params });
  const value = await evaluate(tree, { dataset, params });
  return (await value.get()) as T;
}
