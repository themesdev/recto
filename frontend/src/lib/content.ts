// What the pages read, typed by the sections they fill. Every function takes `preview` (draft mode): drafts instead of
// published documents.
import 'server-only';
import type { SectionBlock } from '../sections/sanity/PageBuilder';
import type { AnnouncementContent } from '../sections/items/sections/announcement/types';
import type { HeaderContent } from '../sections/items/sections/header/types';
import type { FooterContent } from '../sections/items/sections/footer/types';
import type { PostsPost } from '../sections/items/sections/posts/types';
import { query } from './data';
import { feedQuery, pageQuery, postCountQuery, postListQuery, postQuery, postSlugsQuery, siteQuery } from './queries';

export type Block = SectionBlock & { id?: string | null };

export interface Page {
  title: string;
  description?: string | null;
  slug: string;
  sections?: Block[] | null;
}

export interface Site {
  announcement?: AnnouncementContent | null;
  header: HeaderContent;
  footer: FooterContent;
  organisation?: { legalName?: string | null; email?: string | null } | null;
}

export interface Post extends PostsPost {
  author?: (NonNullable<PostsPost['author']> & { role?: string | null; bio?: string | null }) | null;
}

export async function getSite(preview = false) {
  const site = await query<Site | null>(siteQuery, {}, { preview });
  if (!site?.header || !site?.footer) throw new Error('No Site document with a header and a footer: run pnpm seed, or fill in Site in the Studio.');
  return { ...site, name: site.header.brand.name, tagline: site.footer.brand?.tagline ?? '' };
}

export const getPage = (slug: string, preview = false) => query<Page | null>(pageQuery, { slug }, { preview });

export const getPosts = (start: number, end: number, preview = false) => query<PostsPost[]>(postListQuery, { start, end }, { preview });

export const getPostCount = (preview = false) => query<number>(postCountQuery, {}, { preview });

export const getPost = (slug: string, preview = false) => query<Post | null>(postQuery, { slug }, { preview });

export const getPostSlugs = () => query<{ slug: string; date: string }[]>(postSlugsQuery);

export const getFeed = () => query<{ title: string; slug: string; date: string; excerpt?: string | null; tags?: string[] | null }[]>(feedQuery);
