// Rich text (Portable Text, parts/kinds.ts › RichText) as HTML with @portabletext/react: paragraphs, h2–h4, quotes,
// nested lists, strong, em, inline code, links, images (with a caption: figure and figcaption), code blocks
// (highlighted on the server, with a file name as their title) and tables. The same DOM as RichText.astro. The
// elements are plain: the root's .prose (site/styles/prose.css) styles them. Unknown types render nothing; a server
// component, no script in the browser.
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { cn } from '../../../recipes/cn';
import type { RichText as RichTextValue, RichTextCode, RichTextImage, RichTextLink, RichTextTable } from '../../kinds';
import { codeLanguage, highlight } from '../code';
import { CopyButton } from '../../copy/react/CopyButton';
import { CODE_COPY_LABEL } from '../../copy/shared';
import { blockCallout, blockEndpoint, richTextClasses as c, safeHref, tableRows, withHeadingIds } from '../shared';
import { srcSetProps } from '../../image/responsive';

function Code({ value }: { value: RichTextCode }) {
  if (!value.code) return null;
  return (
    <figure className={c.codeFigure} data-copy-scope="">
      {value.filename ? <figcaption className={c.codeTitle}>{value.filename}</figcaption> : null}
      <pre tabIndex={0} data-language={codeLanguage(value.language) ?? 'text'} data-copy-source="">
        <code dangerouslySetInnerHTML={{ __html: highlight(value.code, value.language) }} />
      </pre>
      <CopyButton label={CODE_COPY_LABEL} className={c.codeCopy} />
    </figure>
  );
}

function Table({ value }: { value: RichTextTable }) {
  const { head, body } = tableRows(value.rows);
  if (!head.length) return null;
  return (
    <table tabIndex={0}>
      <thead>
        <tr>
          {head.map((cell, i) => (
            <th key={i} scope="col">
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Image({ value }: { value: RichTextImage }) {
  if (!value.src) return null;
  const img = <img src={value.src} {...srcSetProps(value, 'prose')} alt={value.alt ?? ''} width={value.width} height={value.height} loading="lazy" decoding="async" />;
  return value.caption ? (
    <figure>
      {img}
      <figcaption>{value.caption}</figcaption>
    </figure>
  ) : (
    img
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children, value }) => <p data-endpoint={blockEndpoint(value)}>{children}</p>,
    h2: ({ children, value }) => <h2 id={(value as any).__id}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={(value as any).__id}>{children}</h3>,
    h4: ({ children, value }) => <h4 id={(value as any).__id}>{children}</h4>,
    blockquote: ({ children, value }) => {
      const callout = blockCallout(value);
      return callout ? (
        <blockquote data-callout={callout}>
          <p>{children}</p>
        </blockquote>
      ) : (
        <blockquote>{children}</blockquote>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: ({ children }) => <li>{children}</li>,
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => <code>{children}</code>,
    link: ({ children, value }) => <a href={safeHref((value as RichTextLink | undefined)?.href)}>{children}</a>,
  },
  types: { image: Image, sectionCode: Code, sectionTable: Table },
  hardBreak: () => <br />,
  unknownType: () => null,
  unknownMark: ({ children }) => <>{children}</>,
  unknownBlockStyle: ({ children }) => <p>{children}</p>,
  unknownList: ({ children }) => <ul>{children}</ul>,
  unknownListItem: ({ children }) => <li>{children}</li>,
};

export interface RichTextProps {
  value?: RichTextValue | null;
  className?: string;
}

export function RichText({ value, className }: RichTextProps) {
  return (
    <div className={cn(c.root, className)}>
      <PortableText value={withHeadingIds(value) as any[]} components={components} onMissingComponent={false} />
    </div>
  );
}
