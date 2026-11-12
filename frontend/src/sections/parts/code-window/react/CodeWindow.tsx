// A code window (../shared.ts): a figure named by its file name, the code highlighted on the server, a copy button.
// A server component: a client component takes the highlighted result (highlightCode) and draws CodeFrame instead,
// so the highlighter never reaches the browser.
import { codeLanguage, highlight } from '../../rich-text/code';
import { CodeFrame, type HighlightedCode } from './CodeFrame';

export interface CodeWindowProps {
  code: string;
  language?: string | null;
  filename?: string | null;
  className?: string;
}

/** Highlight on the server, for a client component's CodeFrame. */
export const highlightCode = ({ code, language, filename }: { code: string; language?: string | null; filename?: string | null }): HighlightedCode => ({
  html: highlight(code, language),
  language: codeLanguage(language) ?? 'text',
  filename,
});

export function CodeWindow({ code, language, filename, className }: CodeWindowProps) {
  return <CodeFrame {...highlightCode({ code, language, filename })} className={className} />;
}
