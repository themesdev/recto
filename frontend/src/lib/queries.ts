// The GROQ this theme runs. The library's generated queries (src/sections/sanity/queries.ts) with this theme's
// additions to the schema (studio/schema/index.ts): a section's anchor becomes its id, a post's author brings a role
// and bio, and the Site document its organisation.
import * as lib from '../sections/sanity/queries';

function patch(query: string, find: string, replace: string) {
  if (!query.includes(find)) throw new Error(`queries: "${find}" not found; did the library's queries change?`);
  return query.replace(find, replace);
}

/** One page by its slug (home, blog, about), with its sections; each block's anchor is its id. */
export const pageQuery = patch(lib.pageQuery, '"sections": sections[]{', '"sections": sections[]{ "id": anchor,');

/** Announcement, header and footer, plus the organisation for structured data. */
export const siteQuery = (() => {
  if (!/\s}$/.test(lib.siteSettingsQuery)) throw new Error('queries: the site settings query changed shape');
  return lib.siteSettingsQuery.replace(/\s}$/, ', organisation{ legalName, email } }');
})();

/** One page of posts, newest first: $start and $end. */
export const postListQuery = lib.postListQuery;

export const postCountQuery = lib.postCountQuery;

/** One whole post by $slug, its author with role and bio. */
export const postQuery = patch(lib.postQuery, 'author{ name, ', 'author{ name, role, bio, ');

/** Every post's slug and date (static pages, the sitemap). */
export const postSlugsQuery = `*[_type == "post" && defined(slug.current)] | order(date desc){ "slug": slug.current, date }`;

/** The posts for the feed: newest first, with their excerpt and tags. */
export const feedQuery = `*[_type == "post" && defined(slug.current)] | order(date desc)[0...50]{ title, "slug": slug.current, date, excerpt, tags }`;
