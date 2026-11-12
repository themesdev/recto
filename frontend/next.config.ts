import { join } from 'node:path';
import type { NextConfig } from 'next';

// The Studio's address, for the Presentation tool: it shows the site in a frame, so the site must allow that origin to
// frame it (and nobody else). Set SANITY_STUDIO_URL to your deployed Studio (https://<name>.sanity.studio).
const studio = process.env.SANITY_STUDIO_URL || 'http://localhost:3333';
const dev = process.env.NODE_ENV !== 'production';

// Content-Security-Policy. Scripts and styles only from this site (Next.js puts small inline bootstrap scripts in
// every page, hence 'unsafe-inline'; no eval outside `next dev`), images from here and Sanity's CDN, no plugins, no
// framing except by your Studio, forms only to this site. Posting a form to a service elsewhere (Formspree …)?
// Add its origin to form-action.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self'",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  `frame-ancestors 'self' ${studio}`,
].join('; ');

const nextConfig: NextConfig = {
  // Addresses end in a slash (/pricing/), as every link in the content does.
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // The repository (studio/ and frontend/, one pnpm workspace) is the root: the packages live in its node_modules.
  outputFileTracingRoot: join(import.meta.dirname, '..'),
  turbopack: { root: join(import.meta.dirname, '..') },
  // The stylesheet (about 14 KB compressed) is a normal <link>, not inlined (experimental.inlineCss): inlined, the same
  // 56 KB of CSS also went into the page's RSC payload, a 194 KB home page (LCP 2.4 s). As a file it is one cached
  // request: an 81 KB home page, LCP 2.0 s, scores unchanged (10 Nov 2026).
  experimental: { inlineCss: false },
  // Each post as Markdown at its own address plus .md (/blog/<slug>.md), served by app/blog-md, for answer engines.
  async rewrites() {
    return { beforeFiles: [{ source: '/blog/:slug.md', destination: '/blog-md/:slug/' }], afterFiles: [], fallback: [] };
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
    ];
  },
};

export default nextConfig;
