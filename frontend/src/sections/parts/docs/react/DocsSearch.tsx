'use client';
// Docs search (../shared.ts): a button, and / or Ctrl/⌘K, opens a dialog that searches the JSON index at `index` in
// the browser (fetched on first open). Results are links; the arrow keys move between the field and them.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../../icon/react/Icon';
import { DOCS_SEARCH, docsSearchClasses, searchArrows, searchDocs, searchShortcut, type DocsSearchEntry } from '../shared';

export interface DocsSearchProps {
  /** The search index: a JSON array of DocsSearchEntry. */
  index: string;
  className?: string;
}

export function DocsSearch({ index, className }: DocsSearchProps) {
  const c = docsSearchClasses(className);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const loading = useRef<Promise<void> | undefined>(undefined);
  const [entries, setEntries] = useState<DocsSearchEntry[]>();
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const load = useCallback(
    () =>
      (loading.current ??= fetch(index)
        .then((r) => r.json())
        .then((d: DocsSearchEntry[]) => setEntries(d))
        .catch(() => setFailed(true))),
    [index],
  );
  const open = useCallback(() => {
    const d = dialog.current;
    if (!d || d.open) return;
    d.showModal();
    input.current?.select();
    void load();
  }, [load]);
  useEffect(() => searchShortcut(open), [open]);
  const q = query.trim();
  const results = q && entries ? searchDocs(entries, q) : [];
  const status = failed ? DOCS_SEARCH.failed : !q ? '' : !entries ? DOCS_SEARCH.loading : results.length ? DOCS_SEARCH.count(results.length) : DOCS_SEARCH.none(q);
  return (
    <div className={c.root} data-docs-search="" data-index={index}>
      <button type="button" className={c.button} aria-haspopup="dialog" data-search-open="" onClick={open}>
        <Icon name="search" size={16} />
        <span className={c.buttonLabel}>{DOCS_SEARCH.label}</span>
        <kbd className={c.kbd} aria-hidden="true">
          /
        </kbd>
      </button>
      <dialog
        ref={dialog}
        className={c.dialog}
        aria-label={DOCS_SEARCH.dialog}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        onKeyDown={(e) => dialog.current && searchArrows(e.nativeEvent, dialog.current)}
      >
        <div className={c.field}>
          <Icon name="search" size={18} />
          <input
            ref={input}
            type="search"
            className={c.input}
            placeholder={DOCS_SEARCH.placeholder}
            aria-label={DOCS_SEARCH.dialog}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className={c.close} data-search-close="" onClick={() => dialog.current?.close()}>
            <Icon name="x" size={18} />
            <span className="sr-only">{DOCS_SEARCH.close}</span>
          </button>
        </div>
        <p className={c.status} role="status">
          {status}
        </p>
        <ul role="list" className={c.results}>
          {results.map((r) => (
            <li key={r.href}>
              <a href={r.href} className={c.result} data-search-result="" onClick={() => dialog.current?.close()}>
                <span className={c.resultTitle}>{r.title}</span>
                <span className={c.resultContext}>{r.context}</span>
              </a>
            </li>
          ))}
        </ul>
      </dialog>
    </div>
  );
}
