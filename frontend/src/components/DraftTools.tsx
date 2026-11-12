'use client';
// Draft mode only (the Studio's Presentation tool, or /api/draft-mode/enable): Sanity's visual-editing bridge and a
// link out of the preview. The bridge is loaded on demand, so its code never reaches a visitor's browser.
import dynamic from 'next/dynamic';

const VisualBridge = dynamic(() => import('./VisualBridge'), { ssr: false });

export function DraftTools() {
  return (
    <>
      <VisualBridge />
      <p className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-2 text-center text-size-sm text-foreground">
        Preview: you are seeing drafts. <a href="/api/draft-mode/disable/" className="font-medium text-primary-soft-foreground underline underline-offset-4">Leave the preview</a>
      </p>
    </>
  );
}
