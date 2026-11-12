// The one way pages read content: query(groq, params). Published content comes from Sanity through Next's cache and
// is regenerated in the background every REVALIDATE seconds (and at once by the webhook in app/api/revalidate);
// in draft mode (the Studio's Presentation tool) drafts come straight from the API with the read token.
import 'server-only';
import { client, previewClient } from '../sanity/client';
import { projectId } from '../sanity/env';

/** Seconds a published page is served from the cache before Next rebuilds it in the background. */
export const REVALIDATE = 60;

const fixture = !projectId;
if (fixture && process.env.NODE_ENV === 'production' && process.env.SANITY_FIXTURE !== '1')
  throw new Error('No Sanity project: set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET (README › Set up Sanity). To build the demo content from seed/ instead, set SANITY_FIXTURE=1.');

export const usingFixture = fixture;

export async function query<T>(groq: string, params: Record<string, unknown> = {}, { preview = false }: { preview?: boolean } = {}): Promise<T> {
  if (fixture) return (await import('./fixture')).fixtureQuery<T>(groq, params);
  if (preview) return previewClient.fetch<T>(groq, params, { cache: 'no-store' });
  return client.fetch<T>(groq, params, { next: { revalidate: REVALIDATE, tags: ['sanity'] } });
}
