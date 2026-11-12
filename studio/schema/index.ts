// The Studio's schema: the section library's generated types (./generated, written by the theme's section sync: do
// not edit them there), plus four additions this theme needs:
//   - every page section gets an optional Anchor, so a link can jump to it (/#product, /pricing/#compare);
//   - a post's author gets a role and a short bio (the byline and the author box under a post);
//   - the Site document gets the organisation behind the site (structured data) and an SEO note;
//   - a Posts section may be left empty: it then shows the newest posts (the site fills it, src/lib/latest.ts).
import { defineField } from 'sanity';
import { schemaTypes as generated } from './generated/sanity';

/** The sections that belong to the Site document, not to a page: they get no anchor. */
const SITE_SECTIONS = new Set(['announcementSection', 'headerSection', 'footerSection']);

const anchor = defineField({
  name: 'anchor',
  title: 'Anchor',
  description: 'Optional. Lets a link jump to this section: product gives /#product. Lowercase letters, digits and hyphens.',
  type: 'string',
  validation: (rule) => rule.regex(/^[a-z][a-z0-9-]*$/, { name: 'anchor' }).max(40),
});

const authorFields = [
  defineField({ name: 'role', title: 'Role', description: 'Shown after the name: Co-founder, product.', type: 'string', validation: (rule) => rule.max(60) }),
  defineField({ name: 'bio', title: 'Bio', description: 'One or two sentences for the box under each post.', type: 'text', rows: 3, validation: (rule) => rule.max(280) }),
];

const organisation = defineField({
  name: 'organisation',
  title: 'Organisation',
  description: 'The company behind the site, for search engines (structured data on the home page and posts).',
  type: 'object',
  fields: [
    defineField({ name: 'legalName', title: 'Legal name', type: 'string', validation: (rule) => rule.max(80) }),
    defineField({ name: 'email', title: 'Email address', type: 'string', validation: (rule) => rule.email() }),
  ],
});

type Field = { name: string; type: string; fields?: Field[] } & Record<string, unknown>;
type Type = { name: string; type: string; fields?: Field[] } & Record<string, unknown>;

/** Posts: optional, so an empty list can mean "the newest". */
const latestPosts = (f: Field): Field =>
  f.name === 'posts'
    ? { ...f, description: 'Pick posts to show them in this order, or leave empty for the newest: four for Featured, three for Grid, six for List.', validation: (rule: { max: (n: number) => unknown }) => rule.max(24) }
    : f;

function extend(t: Type): Type {
  if (t.name === 'postsSection') t = { ...t, fields: (t.fields ?? []).map(latestPosts) };
  if (t.type === 'object' && t.name.endsWith('Section') && !SITE_SECTIONS.has(t.name)) return { ...t, fields: [...(t.fields ?? []), anchor as unknown as Field] };
  if (t.name === 'post')
    return { ...t, fields: (t.fields ?? []).map((f) => (f.name === 'author' ? { ...f, fields: [...(f.fields ?? []), ...(authorFields as unknown as Field[])] } : f)) };
  if (t.name === 'siteSettings') return { ...t, fields: [...(t.fields ?? []), organisation as unknown as Field] };
  return t;
}

export const schemaTypes = (generated as unknown as Type[]).map(extend) as unknown as typeof generated;
