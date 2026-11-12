// A docs page's body (Portable Text) back to Markdown: what Copy page copies and /docs/<group>/<slug>.md serves, and
// plain text for the search index. Headings, paragraphs, lists, quotes (callouts stay **Note** …), inline code, bold,
// italic, links, code blocks with their file name, tables and images.
import type { RichText } from '../sections/parts/kinds';

type Span = { text?: string; marks?: string[] };
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Portable Text blocks of several shapes
type Block = Record<string, any>;

function inline(b: Block) {
  const defs = new Map<string, string>((b.markDefs ?? []).map((d: { _key: string; href: string }) => [d._key, d.href]));
  return (b.children ?? [])
    .map((s: Span) => {
      let t = s.text ?? '';
      const marks = s.marks ?? [];
      if (marks.includes('code')) t = `\`${t}\``;
      if (marks.includes('em')) t = `_${t}_`;
      if (marks.includes('strong')) t = `**${t}**`;
      const link = marks.map((m) => defs.get(m)).find(Boolean);
      return link ? `[${t}](${link})` : t;
    })
    .join('');
}

export function toMarkdown(body?: RichText | null) {
  const out: string[] = [];
  let listOpen = false;
  for (const b of (body ?? []) as Block[]) {
    const isList = b._type === 'block' && b.listItem;
    if (listOpen && !isList) out.push('');
    listOpen = !!isList;
    if (b._type === 'block') {
      const text = inline(b);
      if (b.listItem) out.push(`${'  '.repeat(Math.max(0, (b.level ?? 1) - 1))}${b.listItem === 'number' ? '1.' : '-'} ${text}`);
      else if (b.style === 'h2' || b.style === 'h3' || b.style === 'h4') out.push(`${'#'.repeat(Number(b.style[1]))} ${text}`, '');
      else if (b.style === 'blockquote') out.push(`> ${text}`, '');
      else out.push(text, '');
    } else if (b._type === 'sectionCode') {
      out.push(`\`\`\`${b.language ?? ''}${b.filename ? ` title="${b.filename}"` : ''}`, String(b.code ?? '').replace(/\n$/, ''), '```', '');
    } else if (b._type === 'sectionTable') {
      const rows: string[][] = (b.rows ?? []).map((r: { cells?: string[] }) => r.cells ?? []);
      if (!rows.length) continue;
      out.push(`| ${rows[0].join(' | ')} |`, `| ${rows[0].map(() => '---').join(' | ')} |`, ...rows.slice(1).map((r) => `| ${r.join(' | ')} |`), '');
    } else if (b._type === 'image' && b.src) {
      out.push(`![${b.alt ?? ''}](${b.src})`, '');
    }
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** The body as plain text, without code blocks: for the search index. */
export function toPlainText(body?: RichText | null) {
  return ((body ?? []) as Block[])
    .filter((b) => b._type === 'block')
    .map((b) => (b.children ?? []).map((s: Span) => s.text ?? '').join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
