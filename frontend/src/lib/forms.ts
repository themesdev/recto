// The newsletter form's handler (app/api/newsletter); add a form here to give it the same treatment. Plain Request → Response with
// no Next.js imports, so tests/forms.test.ts runs it directly.
//   - A submission with the hidden honeypot field filled is a bot: it gets the normal answer (to /thanks/), so it
//     learns nothing, and it is dropped: not forwarded, not logged.
//   - Required fields missing or an invalid address: back to the form's page with ?error=1.
//   - Without FORWARD_URL the handler fails closed: 503, nothing accepted. The log says which form had a submission
//     and never what was in it (no names, addresses or messages in the logs).
//   - Otherwise the fields go as JSON to FORWARD_URL (your CRM, a chat webhook, an email API) and the visitor to /thanks/.

/** The honeypot's name in the forms (src/sections/parts/field/shared.ts › HONEYPOT_NAME). */
export const HONEYPOT = 'company_website';
export const FORMS = { newsletter: ['email'] } as const;
export type FormName = keyof typeof FORMS;
/** Where a form goes back to when a field is missing. */
const ERROR_PAGE: Record<FormName, string> = { newsletter: '/blog/?error=1' };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_BYTES = 64 * 1024;

export interface FormEnv {
  FORWARD_URL?: string;
}
export interface FormDeps {
  log?: (message: string) => void;
  fetch?: typeof fetch;
}

const text = (body: string, status: number) => new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });

/** The request body, or null as soon as it passes `max` bytes (the rest is not read). */
async function readCapped(request: Request, max: number): Promise<Uint8Array<ArrayBuffer> | null> {
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const out = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.byteLength;
  }
  return out;
}

export async function handleForm(form: FormName, request: Request, env: FormEnv, { log = console.error, fetch: send = fetch }: FormDeps = {}): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
  const type = request.headers.get('content-type') ?? '';
  if (!/^(application\/x-www-form-urlencoded|multipart\/form-data)\b/i.test(type)) return text('This form expects a form submission.', 415);
  // The size cap counts the bytes as they arrive: a Content-Length header can be missing (chunked) or wrong.
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES) return text('This submission is too large.', 413);
  const body = await readCapped(request, MAX_BYTES);
  if (body === null) return text('This submission is too large.', 413);
  let fields: FormData;
  try {
    fields = await new Response(body, { headers: { 'content-type': type } }).formData();
  } catch {
    return text('This form expects a form submission.', 400);
  }
  const data = Object.fromEntries([...fields.entries()].map(([k, v]) => [k, typeof v === 'string' ? v.slice(0, 5000) : '']));
  const back = (path: string) => new Response(null, { status: 303, headers: { location: new URL(path, request.url).href, 'cache-control': 'no-store' } });

  // A filled honeypot is a bot: answer as if it worked, and drop it.
  if (data[HONEYPOT]) return back('/thanks/');
  const missing = FORMS[form].filter((k) => !data[k]?.trim());
  if (missing.length || !EMAIL.test(data.email ?? '')) return back(ERROR_PAGE[form]);

  // Fail closed: without a destination nothing is accepted, and the log names the form only.
  if (!env.FORWARD_URL) {
    log(`form "${form}": a submission arrived but FORWARD_URL is not set; it was not accepted`);
    return text('This form is not connected yet, so your message was not sent. Please email us instead.', 503);
  }
  delete data[HONEYPOT];
  let res: Response;
  try {
    res = await send(env.FORWARD_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...data, form, receivedAt: new Date().toISOString() }) });
  } catch {
    log(`form "${form}": forwarding failed (no answer)`);
    return text('Your message could not be sent. Please try again later.', 502);
  }
  if (!res.ok) {
    log(`form "${form}": forwarding failed with status ${res.status}`);
    return text('Your message could not be sent. Please try again later.', 502);
  }
  return back('/thanks/');
}
