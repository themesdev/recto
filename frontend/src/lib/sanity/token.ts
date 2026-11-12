// The read token: server only. `server-only` makes the build fail if a client component ever imports this file, so the
// token can't end up in a browser bundle. It reads drafts for the preview (draft mode); published pages need none.
import 'server-only';

export const readToken = process.env.SANITY_API_READ_TOKEN || '';
