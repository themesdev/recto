// A Sanity webhook (README › Publish without waiting) calls this when a document is published, so the site shows it at
// once instead of within a minute. The body is signed with SANITY_REVALIDATE_SECRET; anything else is refused.
import { revalidatePath } from 'next/cache';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response('SANITY_REVALIDATE_SECRET is not set', { status: 501 });
  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? '';
  if (!(await isValidSignature(body, signature, secret))) return new Response('Invalid signature', { status: 401 });
  // A small site: every page shares the header and footer, so one publish refreshes them all.
  revalidatePath('/', 'layout');
  return Response.json({ revalidated: true });
}
