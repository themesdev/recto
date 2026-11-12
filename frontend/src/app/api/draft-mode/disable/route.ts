// Leaves the preview: published content again.
import { draftMode } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  (await draftMode()).disable();
  return new Response(null, { status: 307, headers: { location: new URL('/', request.url).href } });
}
