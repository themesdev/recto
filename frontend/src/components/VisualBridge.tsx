'use client';
// Sanity's visual-editing bridge (draft mode only, loaded by ./DraftTools): it refreshes the page when a draft changes
// and keeps the Studio's address bar in step with the page.
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { VisualEditing } from '@sanity/visual-editing/react';
import type { HistoryAdapter, HistoryAdapterNavigate } from '@sanity/visual-editing';

export default function VisualBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const [navigate, setNavigate] = useState<HistoryAdapterNavigate | undefined>();
  const history = useMemo<HistoryAdapter>(
    () => ({
      subscribe: (n) => {
        setNavigate(() => n);
        return () => setNavigate(undefined);
      },
      update: (u) => {
        if (u.type === 'push') router.push(u.url);
        else if (u.type === 'replace') router.replace(u.url);
        else if (u.type === 'pop') router.back();
      },
    }),
    [router],
  );
  useEffect(() => navigate?.({ type: 'push', url: pathname }), [navigate, pathname]);
  return <VisualEditing portal history={history} refresh={() => Promise.resolve(router.refresh())} />;
}
