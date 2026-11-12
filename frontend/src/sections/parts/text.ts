// Text helpers shared by the Astro and React sections. Framework-free.

/** A text field as paragraphs: split on blank lines, trimmed, empty ones dropped. A single newline stays inside its
 *  paragraph (the browser folds it into a space), so editors break paragraphs with an empty line, as in an email. */
export const paragraphs = (text?: string | null): string[] =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
