// The newsletter form posts here (its action in the Studio: /api/newsletter/). See src/lib/forms.ts.
import { handleForm } from '../../../lib/forms';

export const dynamic = 'force-dynamic';

export function POST(request: Request) {
  return handleForm('newsletter', request, { FORWARD_URL: process.env.FORWARD_URL });
}
