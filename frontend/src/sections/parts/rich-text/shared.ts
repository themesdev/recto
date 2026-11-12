// Rich text (Portable Text, parts/kinds.ts › RichText): what RichText.astro and react/RichText.tsx share, so both draw
// the same DOM. Framework-free. The elements carry no classes of their own: the root is .prose and
// site/styles/prose.css styles what is inside it (headings, lists, quotes, code, figures, tables, the rhythm between
// them), the same stylesheet a Markdown site wraps its rendered posts in. One source for both kinds of article.

export const richTextClasses = {
  /** The reading column (65ch) and everything inside it: site/styles/prose.css. */
  root: 'prose',
  /** A code block with a file name: <figure class="code-block"><figcaption class="code-title">. */
  codeFigure: 'code-block',
  codeTitle: 'code-title',
  /** The copy button in the code block's top corner (parts/copy). */
  codeCopy: 'code-copy',
};

/** The heading and paragraph styles the renderer knows; anything else renders as a paragraph. */
export const blockTag = (style?: string | null) => (style === 'h2' || style === 'h3' || style === 'h4' || style === 'blockquote' ? style : 'p');

/** A link's href from the CMS, only when it is a page, an anchor, http(s), mailto: or tel: (never javascript:). */
export const safeHref = (href?: string | null) => (href && /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(href.trim()) ? href.trim() : undefined);

/** A table block's rows split into the header row (the first) and the body rows, every row as wide as the widest.
 *  Rows without cells are dropped. */
export function tableRows(rows?: { cells?: (string | null)[] | null }[] | null) {
  const all = (rows ?? []).map((r) => (r?.cells ?? []).map((c) => c ?? '')).filter((cells) => cells.length);
  const width = Math.max(0, ...all.map((cells) => cells.length));
  const pad = (cells: string[]) => [...cells, ...Array<string>(width - cells.length).fill('')];
  return { head: all.length ? pad(all[0]) : [], body: all.slice(1).map(pad) };
}

/** A heading's id, as Astro's Markdown gives it (github-slugger): lower case, punctuation dropped, spaces to hyphens.
 *  Letters and digits of every script stay. */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
    .replace(/\s/g, '-');

const plain = (block: any) => (block?.children ?? []).map((c: any) => c?.text ?? '').join('');

/** The h2 and h3 of a rich text with their ids (unique: a repeat gets -1, -2 as github-slugger does), for a table of
 *  contents. RichText gives the headings these ids. */
export function richTextHeadings(value?: readonly any[] | null) {
  const seen = new Map<string, number>();
  const out: { depth: 2 | 3; text: string; id: string; key?: string }[] = [];
  for (const b of value ?? []) {
    if (b?._type !== 'block' || b.listItem || (b.style !== 'h2' && b.style !== 'h3' && b.style !== 'h4')) continue;
    const text = plain(b);
    const base = slugify(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    const id = n ? `${base}-${n}` : base;
    if (b.style !== 'h4') out.push({ depth: b.style === 'h2' ? 2 : 3, text, id, key: b._key });
    b.__id = id;
  }
  return out;
}

/** The blocks with their heading ids set (as __id), for the renderers. A copy: the input is left as it is. */
export const withHeadingIds = (value?: readonly any[] | null) => {
  const copy = (value ?? []).map((b) => (b && typeof b === 'object' ? { ...b } : b));
  richTextHeadings(copy);
  return copy;
};

/** Callouts: a quote whose first word is bold Note, Tip or Warning (> **Note** Retries count …) becomes a callout box,
 *  in Markdown (rehype.ts) and in rich text alike. */
export const CALLOUTS = { note: 'Note', tip: 'Tip', warning: 'Warning' } as const;
export type CalloutKind = keyof typeof CALLOUTS;
export const calloutKind = (firstBold?: string | null): CalloutKind | undefined => {
  const word = firstBold?.trim().replace(/[:.]$/, '').toLowerCase();
  return word && word in CALLOUTS ? (word as CalloutKind) : undefined;
};
/** A rich-text quote block's callout kind: its first span is strong and says Note, Tip or Warning. */
export const blockCallout = (block: any): CalloutKind | undefined => {
  if (block?._type !== 'block' || block.style !== 'blockquote') return undefined;
  const first = block.children?.[0];
  return first?.marks?.includes('strong') ? calloutKind(first.text) : undefined;
};

/** An API endpoint line: a paragraph that is only inline code like POST /v1/runs. Gives the method, lower case. */
export const endpointMethod = (code?: string | null) => code?.trim().match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS) \/\S*$/)?.[1].toLowerCase();
/** A rich-text block that is an endpoint line: one span, marked code, nothing else. */
export const blockEndpoint = (block: any) => {
  if (block?._type !== 'block' || block.listItem || (block.style && block.style !== 'normal') || block.children?.length !== 1) return undefined;
  const span = block.children[0];
  return span?.marks?.length === 1 && span.marks[0] === 'code' ? endpointMethod(span.text) : undefined;
};
