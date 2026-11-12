// The code window's markup (../CodeWindow.astro), from code already highlighted: what a client component draws, so the
// highlighter (Shiki and its grammars) stays on the server. CodeWindow highlights and renders this.
import { CopyButton } from '../../copy/react/CopyButton';
import { CODE_COPY_LABEL } from '../../copy/shared';
import { codeWindowClasses } from '../shared';

export interface HighlightedCode {
  /** The lines as HTML (parts/rich-text/code.ts › highlight). */
  html: string;
  /** The highlighter's language, or text. */
  language: string;
  filename?: string | null;
}

export function CodeFrame({ html, language, filename, className }: HighlightedCode & { className?: string }) {
  const c = codeWindowClasses(className);
  return (
    <figure className={c.root} data-copy-scope="" aria-label={filename || 'Code example'}>
      <div className={c.bar}>
        <span className={c.dots} aria-hidden="true">
          <span className={c.dot} />
          <span className={c.dot} />
          <span className={c.dot} />
        </span>
        <span className={c.filename}>{filename}</span>
        <CopyButton label={CODE_COPY_LABEL} />
      </div>
      <pre className={c.pre} tabIndex={0} data-language={language} data-copy-source="">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  );
}
