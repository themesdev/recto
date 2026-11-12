// Code blocks: syntax colours from the active tokens, at render time (no script in the browser). Framework-free: the
// rich-text renderers (Astro and React) call highlight(), and a Markdown site passes codeTheme and codeTransformers to
// its Shiki config (Astro: markdown.shikiConfig), so a Markdown code block and a Portable Text one end up the same.
//
// The theme is Shiki's CSS-variables theme: every colour is a custom property (--code-token-keyword …) that
// site/styles/prose.css sets from the tokens, so code follows the preset and its dark mode without a second theme.
// The highlighter is synchronous, on Shiki's JavaScript regex engine (no WebAssembly: it runs in a Worker as it does
// in Node), with a fixed set of languages; any other language is shown as plain text.
import { createCssVariablesTheme, createHighlighterCoreSync, hastToHtml, type ShikiTransformer } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import bash from 'shiki/langs/shellscript.mjs';
import css from 'shiki/langs/css.mjs';
import diff from 'shiki/langs/diff.mjs';
import go from 'shiki/langs/go.mjs';
import html from 'shiki/langs/html.mjs';
import javascript from 'shiki/langs/javascript.mjs';
import json from 'shiki/langs/json.mjs';
import jsx from 'shiki/langs/jsx.mjs';
import markdown from 'shiki/langs/markdown.mjs';
import python from 'shiki/langs/python.mjs';
import sql from 'shiki/langs/sql.mjs';
import tsx from 'shiki/langs/tsx.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import yaml from 'shiki/langs/yaml.mjs';
import { ICON_NODES } from '../icon/icon-nodes';
import { CODE_COPY_LABEL, copyButtonClasses } from '../copy/shared';
import { richTextClasses } from './shared';

/** The theme: token colours as CSS custom properties (--code-foreground, --code-token-keyword …). */
export const codeTheme = createCssVariablesTheme({ name: 'tokens', variablePrefix: '--code-', fontStyle: true });

let highlighter: ReturnType<typeof createHighlighterCoreSync> | undefined;
const get = () =>
  (highlighter ??= createHighlighterCoreSync({
    themes: [codeTheme],
    langs: [bash, css, diff, go, html, javascript, json, jsx, markdown, python, sql, tsx, typescript, yaml],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  }));

/** The language Shiki knows under this name or alias (ts, sh, yml …), or undefined for plain text. */
export function codeLanguage(language?: string | null): string | undefined {
  const name = language?.trim().toLowerCase();
  if (!name) return undefined;
  return get().getLoadedLanguages().includes(name) ? name : undefined;
}

/** A code block's lines as HTML for the inside of its <code> element: one span.line per line, each token a span
 *  coloured by a token variable. Text only; Shiki escapes it. */
export function highlight(code: string, language?: string | null): string {
  const lang = codeLanguage(language) ?? 'text';
  // Per-line limits, generous but finite. Shiki's default time limit (500ms) stopped a line half way when the machine
  // was busy, so the same code came out coloured differently in two builds (parity caught it in hero/code and tabs);
  // 5s per line never trips at build time. It stays finite because this also runs at request time (a Next.js server
  // component rendering rich text from the CMS): a pathological line must not hold the server. A line over 2000
  // characters is left as plain text.
  const root = get().codeToHast(code.replace(/\n$/, ''), { lang, theme: 'tokens', tokenizeTimeLimit: 5000, tokenizeMaxLineLength: 2000 });
  const pre = root.children[0] as any;
  const codeEl = pre?.children?.[0];
  return hastToHtml(codeEl?.children ?? []);
}

/** The file name from a Markdown code fence's meta (```ts title="normalise.ts"), or undefined. */
export function codeTitle(meta?: string | null): string | undefined {
  return meta?.match(/(?:^|\s)(?:title|filename)=(?:"([^"]*)"|'([^']*)'|(\S+))/)?.slice(1).find((x) => x != null) || undefined;
}

/** A Lucide icon as hast, the same <svg> parts/icon/Icon.astro draws. */
const iconHast = (name: keyof typeof ICON_NODES, size: number, className: string): any => ({
  type: 'element',
  tagName: 'svg',
  properties: {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: [className],
    ariaHidden: 'true',
    focusable: 'false',
  },
  children: ICON_NODES[name].map(([tagName, attrs]) => ({ type: 'element', tagName, properties: { ...attrs }, children: [] })),
});

/** The copy button of a code block as hast: the DOM parts/copy/CopyButton.astro draws for label "Copy code". */
const copyButtonHast = (): any => {
  const c = copyButtonClasses(false, richTextClasses.codeCopy);
  return {
    type: 'element',
    tagName: 'button',
    properties: { type: 'button', className: [c.button], dataCopy: '' },
    children: [
      iconHast('copy', 16, c.copy),
      iconHast('check', 16, c.check),
      { type: 'element', tagName: 'span', properties: { className: ['sr-only'] }, children: [{ type: 'text', value: CODE_COPY_LABEL }] },
    ],
  };
};

/** For a Markdown site's Shiki config: every fence becomes <figure class="code-block" data-copy-scope> with the
 *  <pre> (data-copy-source) and a copy button; a fence with title="…" gets <figcaption class="code-title">…
 *  </figcaption> first. The DOM the rich-text renderers give a code block. Put CopyInit (parts/copy) on the page. */
export const codeTransformers: ShikiTransformer[] = [
  {
    name: 'code-block',
    pre(pre) {
      pre.properties.dataCopySource = '';
    },
    root(root) {
      const meta = this.options.meta as { __raw?: string } | undefined;
      const title = codeTitle(meta?.__raw);
      const pre = root.children[0];
      if (!pre) return;
      root.children = [
        {
          type: 'element',
          tagName: 'figure',
          properties: { class: richTextClasses.codeFigure, dataCopyScope: '' },
          children: [
            ...(title ? [{ type: 'element', tagName: 'figcaption', properties: { class: richTextClasses.codeTitle }, children: [{ type: 'text', value: title }] } as any] : []),
            pre as any,
            copyButtonHast(),
          ],
        },
      ];
    },
  },
];
