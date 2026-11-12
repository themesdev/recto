// One safe-redirect helper for every place a theme sends a visitor to a URL it was handed: draft mode's ?redirect=,
// a form's thanks page, a sign-in's ?next=. Framework-free (Astro endpoints, Next.js route handlers, the browser).
//
// The target is resolved the way a browser resolves it, against the page's own origin. Only a URL that lands on that
// same origin is kept, as a path (pathname + search + hash); anything else (another host, a scheme-relative //evil,
// /\evil, javascript:, data:, a tab or newline smuggled into the scheme, an unparseable string) becomes the fallback.

/** A same-origin path for `target`, else `fallback` ('/' by default). `origin`: the request's own, e.g.
 *  new URL(request.url).origin, or location.origin in the browser. */
export function safeRedirect(target: string | null | undefined, origin: string, fallback = '/'): string {
  if (typeof target !== 'string' || target.trim() === '') return fallback;
  let base: URL;
  try {
    base = new URL(origin);
  } catch {
    return fallback;
  }
  let url: URL;
  try {
    url = new URL(target, base);
  } catch {
    return fallback;
  }
  if (url.origin !== base.origin || (url.protocol !== 'http:' && url.protocol !== 'https:')) return fallback;
  const path = `${url.pathname}${url.search}${url.hash}`;
  // A path that a later resolution would read as scheme-relative (//host) is never handed on.
  return path.startsWith('//') || path.startsWith('/\\') ? fallback : path;
}
