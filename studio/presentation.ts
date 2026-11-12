// Where each document shows on the site, for the Presentation tool: which page to open beside a document, and which
// document belongs to an address.
import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

/** A page document's slug → its address on the site (home is /). */
const pagePath = (slug?: string) => (!slug || slug === 'home' ? '/' : `/${slug}/`);

export const locations: PresentationPluginOptions['resolve'] extends infer R ? (R extends { locations?: infer L } ? L : never) : never = {
  page: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => ({ locations: [{ title: doc?.title ?? 'Page', href: pagePath(doc?.slug) }] }),
  }),
  post: defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => ({ locations: [{ title: doc?.title ?? 'Post', href: `/blog/${doc?.slug}/` }, { title: 'Blog', href: '/blog/' }] }),
  }),
  siteSettings: defineLocations({ message: 'The Site document is on every page', tone: 'positive', locations: [{ title: 'Home', href: '/' }] }),
};

export const mainDocuments = defineDocuments([
  { route: '/', filter: `_type == "page" && slug.current == "home"` },
  { route: '/blog/:slug/', filter: `_type == "post" && slug.current == $slug` },
  { route: '/blog/', filter: `_type == "page" && slug.current == "blog"` },
  { route: '/:slug/', filter: `_type == "page" && slug.current == $slug` },
]);
