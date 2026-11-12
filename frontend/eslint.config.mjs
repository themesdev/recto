// ESLint: Next.js's recommended rules (Core Web Vitals) and TypeScript's, for the theme's own code. The vendored
// sections (src/sections) and the generated Studio schema follow the section library's own checks.
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Images are plain <img> with their width, height and alt (no layout shift): demo SVGs and Sanity's CDN, which
      // sizes images itself. next/image would add an optimiser in front of both for no gain.
      '@next/next/no-img-element': 'off',
      // Links are plain <a>, as in every section: a static marketing site gains little from client-side navigation.
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  { ignores: ['.next/**', '.open-next/**', 'node_modules/**', 'studio/node_modules/**', 'studio/dist/**', 'studio/schema/generated/**', 'src/sections/**', 'next-env.d.ts', 'src/lib/og/assets.generated.ts'] },
];

export default config;
