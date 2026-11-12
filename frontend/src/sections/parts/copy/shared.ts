// Copy to the clipboard: a code block, an install command, or a whole page as Markdown. One delegated click listener
// (initCopy) serves every button with a data-copy attribute on the page, so Markdown output (code blocks from Shiki)
// and server-rendered rich text need no script of their own:
//   data-copy="npm install x"       copies that text
//   data-copy=""  (empty)           copies the text of the [data-copy-source] inside the closest [data-copy-scope]
//   data-copy-url="/docs/page.md"   fetches the address and copies its text (Copy page)
// The button gets data-copied for two seconds (the check icon shows), and a polite status line says "Copied".
// Framework-free: CopyButton.astro's script and react/CopyButton.tsx call initCopy.
import { cn } from '../../recipes/cn';

const STATUS_ID = 'copy-status';

const status = (text: string) => {
  let el = document.getElementById(STATUS_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = STATUS_ID;
    el.setAttribute('role', 'status');
    el.className = 'sr-only';
    document.body.append(el);
  }
  el.textContent = text;
};

async function copy(button: HTMLElement) {
  const url = button.getAttribute('data-copy-url');
  const value = button.getAttribute('data-copy');
  if (url) {
    const text = fetch(url).then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))));
    // Safari keeps the click's permission only for a write started inside the click: hand it the pending text.
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write)
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': text.then((t) => new Blob([t], { type: 'text/plain' })) })]);
    else await navigator.clipboard.writeText(await text);
    return;
  }
  let text = value;
  if (!text) text = button.closest('[data-copy-scope]')?.querySelector('[data-copy-source]')?.textContent ?? '';
  if (!text) throw new Error('nothing to copy');
  await navigator.clipboard.writeText(text.replace(/\n$/, ''));
}

/** Install the listener once per page. */
export function initCopy() {
  const w = window as unknown as { __copyInit?: boolean };
  if (w.__copyInit) return;
  w.__copyInit = true;
  document.addEventListener('click', (e) => {
    const button = (e.target as Element | null)?.closest?.<HTMLElement>('[data-copy],[data-copy-url]');
    if (!button) return;
    copy(button).then(
      () => {
        button.setAttribute('data-copied', '');
        status(button.getAttribute('data-copied-label') ?? 'Copied');
        clearTimeout(Number(button.dataset.copyTimer));
        button.dataset.copyTimer = String(
          setTimeout(() => {
            button.removeAttribute('data-copied');
            status('');
          }, 2000),
        );
      },
      () => status('Copy failed: select the text and copy it yourself'),
    );
  });
}

/** A copy button: icon only (a 36px square, named by its label) or with its label in sight. The copy icon turns into
 *  a check while data-copied is set. */
export const copyButtonClasses = (withLabel: boolean, className?: string) => ({
  button: cn(
    's-press group/copy inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-button text-muted-foreground on-hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    withLabel ? 'min-h-9 border border-border bg-background px-3 text-size-sm font-medium text-foreground on-hover:border-border-strong on-hover:bg-foreground/5' : 'size-9 on-hover:bg-foreground/5',
    className,
  ),
  copy: 'group-data-copied/copy:hidden',
  check: 'hidden group-data-copied/copy:block',
});

/** A code block's copy button name. */
export const CODE_COPY_LABEL = 'Copy code';
