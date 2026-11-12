// The docs shell (../shared.ts): the sidebar (in a disclosure below 1024px), the page in the middle (children), On
// this page beside it from 1280px. Put it inside <main>.
import type { ReactNode } from 'react';
import { Icon } from '../../icon/react/Icon';
import { docsShellClasses as c, type DocsGroup, type DocsHeading } from '../shared';
import { DocsSidebar } from './DocsSidebar';
import { DocsToc } from './DocsToc';

export interface DocsShellProps {
  groups: DocsGroup[];
  currentPath?: string | null;
  headings?: DocsHeading[];
  menuLabel?: string;
  children?: ReactNode;
}

export function DocsShell({ groups, currentPath, headings = [], menuLabel = 'Docs menu', children }: DocsShellProps) {
  return (
    <div className={c.root} data-docs-shell="">
      <details className={c.mobile}>
        <summary className={c.summary}>
          {menuLabel}
          <Icon name="chevron-down" size={16} className={c.summaryIcon} />
        </summary>
        <DocsSidebar groups={groups} currentPath={currentPath} className={c.mobileNav} />
      </details>
      <div className={c.aside}>
        <DocsSidebar groups={groups} currentPath={currentPath} />
      </div>
      <div className={c.main}>{children}</div>
      {headings.length ? (
        <div className={c.toc}>
          <DocsToc headings={headings} />
        </div>
      ) : null}
    </div>
  );
}
