// For a Markdown site: the rehype step that gives rendered Markdown what the rich-text renderers give Portable Text,
// so a docs page written in Markdown and one stored in Sanity end in the same DOM:
//   > **Note** …            <blockquote data-callout="note"> (also tip, warning)
//   `POST /v1/runs` alone   <p data-endpoint="post"> (an API endpoint line)
//   a table                 tabindex="0" (a table wider than the column scrolls; the keyboard can scroll it too)
// Astro: markdown: { rehypePlugins: [rehypeRichText] }. Headings already get their ids from Astro (github-slugger),
// the ids richTextHeadings gives rich text.
import { calloutKind, endpointMethod } from './shared';

const text = (n: any): string => (n.type === 'text' ? n.value : (n.children ?? []).map(text).join(''));
const elements = (n: any) => (n.children ?? []).filter((c: any) => c.type === 'element');
const meaningful = (n: any) => (n.children ?? []).filter((c: any) => c.type === 'element' || (c.type === 'text' && c.value.trim()));

function visit(node: any) {
  for (const child of node.children ?? []) {
    if (child.type !== 'element') continue;
    if (child.tagName === 'table') {
      child.properties = { ...child.properties, tabIndex: 0 };
    } else if (child.tagName === 'blockquote') {
      const p = elements(child)[0];
      const strong = p?.tagName === 'p' ? meaningful(p)[0] : undefined;
      const kind = strong?.tagName === 'strong' ? calloutKind(text(strong)) : undefined;
      if (kind) child.properties = { ...child.properties, dataCallout: kind };
    } else if (child.tagName === 'p') {
      const only = meaningful(child);
      if (only.length === 1 && only[0].tagName === 'code') {
        const method = endpointMethod(text(only[0]));
        if (method) child.properties = { ...child.properties, dataEndpoint: method };
      }
    }
    visit(child);
  }
}

export const rehypeRichText = () => (tree: any) => visit(tree);
