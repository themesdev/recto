// The value kinds the section manifests' fields use (schema/item.schema.json › definitions.field), shared by the Astro
// and React components, the generated types.ts files and the generated Sanity schema (sanity/kinds.ts).
// Framework-free: React code imports it in the browser.

/** The ground a section stands on: the page's own, a quiet band, the inverse (dark on a light page), or accent (the
 *  primary colour as the ground, for one band per page: a statement, a CTA). */
export const TONES = ['default', 'muted', 'inverse', 'accent'] as const;
export type Tone = (typeof TONES)[number];

/** The room above and below a section: tight (0.6× space.section), normal, roomy (1.6×). Varied rhythm is a setting. */
export const SPACINGS = ['tight', 'normal', 'roomy'] as const;
export type Spacing = (typeof SPACINGS)[number];

/** A text link. href: absolute (https:), relative (/pricing), an anchor (#features), mailto: or tel:. */
export interface Link {
  label: string;
  href: string;
}

/** A link drawn as a button. One primary per group; the rest secondary. */
export const EMPHASES = ['primary', 'secondary'] as const;
export interface Action extends Link {
  emphasis?: (typeof EMPHASES)[number] | null;
}

/** An image with its intrinsic size (no layout shift) and its text alternative ("" only for decorative images). */
export interface ImageRef {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional: the image at more widths (a theme's image pipeline). Not stored in the CMS: for a Sanity image
   *  parts/image/responsive.ts builds it from the CDN URL. */
  srcset?: string | null;
  /** Optional, with a width srcset: how wide the theme draws this image, when that is wider than the section's slot
   *  says (a wider container, a full-width tile): parts/image/responsive.ts uses it in place of the slot's sizes. */
  sizes?: string | null;
}

/** data-tone for a section root: none for the page's own tone. */
export const toneAttr = (tone?: Tone | null) => (tone && tone !== 'default' ? tone : undefined);

/** data-spacing for a section root: none for normal (site/styles/sections.css scales the section's padding). */
export const spacingAttr = (spacing?: Spacing | null) => (spacing && spacing !== 'normal' ? spacing : undefined);

/** Rich text: Portable Text (Sanity's block content) as the generated GROQ projection returns it. Blocks of text with
 *  a style (normal, h2–h4, blockquote) or a list (bullet, number; level for nesting), spans with decorators (strong,
 *  em, code) and links (markDefs), images with their alt, size and an optional caption, code blocks with an optional
 *  file name, and tables (the first row is the header). parts/rich-text renders it. */
export const RICH_TEXT_STYLES = ['normal', 'h2', 'h3', 'h4', 'blockquote'] as const;
export const RICH_TEXT_LISTS = ['bullet', 'number'] as const;
export const RICH_TEXT_DECORATORS = ['strong', 'em', 'code'] as const;
export interface RichTextSpan {
  _type: 'span';
  _key?: string;
  text: string;
  /** Decorators and the _key of a link in markDefs. */
  marks?: string[];
}
export interface RichTextLink {
  _type: 'link';
  _key: string;
  href: string;
}
export interface RichTextBlock {
  _type: 'block';
  _key?: string;
  style?: (typeof RICH_TEXT_STYLES)[number];
  listItem?: (typeof RICH_TEXT_LISTS)[number];
  level?: number;
  children: RichTextSpan[];
  markDefs?: RichTextLink[];
}
export interface RichTextImage extends ImageRef {
  _type: 'image';
  _key?: string;
  /** Shown under the image (figure and figcaption). */
  caption?: string | null;
}
export interface RichTextCode {
  _type: 'sectionCode';
  _key?: string;
  code: string;
  /** For the highlighter (parts/rich-text/code.ts): ts, css, bash…; another language shows as plain text. */
  language?: string | null;
  /** Shown as the block's title: normalise.ts. */
  filename?: string | null;
}
export interface RichTextTableRow {
  _type?: 'sectionTableRow';
  _key?: string;
  /** Plain text, one per column. */
  cells: string[];
}
export interface RichTextTable {
  _type: 'sectionTable';
  _key?: string;
  /** The first row is the header row. */
  rows: RichTextTableRow[];
}
export type RichText = (RichTextBlock | RichTextImage | RichTextCode | RichTextTable)[];
