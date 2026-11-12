// The Studio's Presentation tool opens the site through here: it checks the one-time secret the Studio created
// (with the read token, server side), turns on draft mode and goes to the page asked for. Nobody else gets in.
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { previewClient } from '../../../../lib/sanity/client';
import { readToken } from '../../../../lib/sanity/token';
import { projectId } from '../../../../lib/sanity/env';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!projectId || !readToken) return new Response('Draft mode needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN.', { status: 501 });
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(previewClient, request.url);
  if (!isValid) return new Response('Invalid secret', { status: 401 });
  (await draftMode()).enable();
  // Only a path on this site: never an address somewhere else.
  redirect(redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/');
}
