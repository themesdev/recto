// The form handler: fails closed without FORWARD_URL, drops honeypot hits, never logs field values.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleForm, HONEYPOT, MAX_BYTES } from '../src/lib/forms.ts';

const SECRET = { name: 'Ada Example', email: 'ada@example.com', message: 'A private message 4815162342', company: 'Example Ltd' };
const post = (fields: Record<string, string>, path = '/api/newsletter/') =>
  new Request(`https://site.example${path}`, { method: 'POST', body: new URLSearchParams(fields), headers: { 'content-type': 'application/x-www-form-urlencoded' } });

function spy() {
  const logs: string[] = [];
  const sent: { url: string; body: string }[] = [];
  return {
    logs,
    sent,
    deps: {
      log: (m: string) => logs.push(m),
      fetch: (async (url: string, init: RequestInit) => {
        sent.push({ url, body: String(init.body) });
        return new Response('ok');
      }) as unknown as typeof fetch,
    },
  };
}
const noValues = (logs: string[]) => {
  for (const v of Object.values(SECRET)) assert.ok(!logs.join('\n').includes(v), `a log line contains "${v}"`);
};

test('fails closed with 503 when FORWARD_URL is missing, logging the form name only', async () => {
  const s = spy();
  const res = await handleForm('newsletter', post(SECRET), {}, s.deps);
  assert.equal(res.status, 503);
  assert.equal(s.sent.length, 0);
  assert.equal(s.logs.length, 1);
  assert.match(s.logs[0], /form "newsletter"/);
  noValues(s.logs);
});

test('a filled honeypot gets the normal success and is dropped (not forwarded, not logged)', async () => {
  for (const env of [{}, { FORWARD_URL: 'https://hooks.example/in' }]) {
    const s = spy();
    const res = await handleForm('newsletter', post({ ...SECRET, [HONEYPOT]: 'https://spam.example' }), env, s.deps);
    assert.equal(res.status, 303);
    assert.equal(res.headers.get('location'), 'https://site.example/thanks/');
    assert.equal(s.sent.length, 0);
    assert.equal(s.logs.length, 0);
  }
});

test('forwards a valid submission as JSON without the honeypot, then redirects to /thanks/', async () => {
  const s = spy();
  const res = await handleForm('newsletter', post({ ...SECRET, [HONEYPOT]: '' }), { FORWARD_URL: 'https://hooks.example/in' }, s.deps);
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), 'https://site.example/thanks/');
  assert.equal(s.sent.length, 1);
  assert.equal(s.sent[0].url, 'https://hooks.example/in');
  const body = JSON.parse(s.sent[0].body);
  assert.equal(body.form, 'newsletter');
  assert.equal(body.email, SECRET.email);
  assert.ok(!(HONEYPOT in body));
  assert.equal(s.logs.length, 0);
});

test('a submitted "form" or "receivedAt" field cannot overwrite the ones the handler sets', async () => {
  const s = spy();
  await handleForm('newsletter', post({ ...SECRET, form: 'contact', receivedAt: '1970-01-01' }), { FORWARD_URL: 'https://hooks.example/in' }, s.deps);
  const body = JSON.parse(s.sent[0].body);
  assert.equal(body.form, 'newsletter');
  assert.notEqual(body.receivedAt, '1970-01-01');
});

test('missing fields or a bad address go back to the form, nothing sent', async () => {
  const s = spy();
  const a = await handleForm('newsletter', post({ name: 'Ada', email: 'not-an-address', message: 'hi' }), { FORWARD_URL: 'https://hooks.example/in' }, s.deps);
  assert.equal(a.status, 303);
  assert.equal(a.headers.get('location'), 'https://site.example/blog/?error=1');
  const b = await handleForm('newsletter', post({}, '/api/newsletter/'), { FORWARD_URL: 'https://hooks.example/in' }, s.deps);
  assert.equal(b.headers.get('location'), 'https://site.example/blog/?error=1');
  assert.equal(s.sent.length, 0);
});

test('a failing destination answers 502 and logs the status, not the values', async () => {
  const logs: string[] = [];
  const res = await handleForm('newsletter', post({ email: SECRET.email }, '/api/newsletter/'), { FORWARD_URL: 'https://hooks.example/in' }, {
    log: (m) => logs.push(m),
    fetch: (async () => new Response('no', { status: 500 })) as unknown as typeof fetch,
  });
  assert.equal(res.status, 502);
  assert.match(logs[0], /form "newsletter": forwarding failed with status 500/);
  noValues(logs);
});

test('only POST', async () => {
  const res = await handleForm('newsletter', new Request('https://site.example/api/newsletter/'), {});
  assert.equal(res.status, 405);
});

/** A body streamed in chunks of 8 KB, with no Content-Length (chunked), or with the one given. */
function streamed(bytes: number, contentLength?: string) {
  let sent = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(c) {
      if (sent >= bytes) return c.close();
      const n = Math.min(8192, bytes - sent);
      sent += n;
      c.enqueue(new TextEncoder().encode('m'.repeat(n)));
    },
  });
  const headers: Record<string, string> = { 'content-type': 'application/x-www-form-urlencoded' };
  if (contentLength) headers['content-length'] = contentLength;
  return { request: new Request('https://site.example/api/newsletter/', { method: 'POST', body, headers, duplex: 'half' } as RequestInit), read: () => sent };
}

test('a chunked body over the cap gets 413, and is not read to the end', async () => {
  const s = spy();
  const { request, read } = streamed(MAX_BYTES * 8);
  const res = await handleForm('newsletter', request, { FORWARD_URL: 'https://hooks.example/in' }, s.deps);
  assert.equal(res.status, 413);
  assert.ok(read() < MAX_BYTES * 2, `read ${read()} bytes`);
  assert.equal(s.sent.length, 0);
});

test('a Content-Length that lies (small header, large body) gets 413', async () => {
  const s = spy();
  const { request } = streamed(MAX_BYTES + 10_000, '100');
  const res = await handleForm('newsletter', request, { FORWARD_URL: 'https://hooks.example/in' }, s.deps);
  assert.equal(res.status, 413);
  assert.equal(s.sent.length, 0);
});

test('only form encodings: JSON gets 415', async () => {
  const res = await handleForm('newsletter', new Request('https://site.example/api/newsletter/', { method: 'POST', body: JSON.stringify(SECRET), headers: { 'content-type': 'application/json' } }), { FORWARD_URL: 'https://hooks.example/in' });
  assert.equal(res.status, 415);
});

test('a multipart post works too', async () => {
  const s = spy();
  const fd = new FormData();
  for (const [k, v] of Object.entries(SECRET)) fd.set(k, v);
  const res = await handleForm('newsletter', new Request('https://site.example/api/newsletter/', { method: 'POST', body: fd }), { FORWARD_URL: 'https://hooks.example/in' }, s.deps);
  assert.equal(res.status, 303);
  assert.equal(s.sent.length, 1);
});
