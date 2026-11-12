// The docs sidebar (../shared.ts): grouped links, the current page marked.
import { docsSidebarClasses, isCurrent, type DocsGroup } from '../shared';

export interface DocsSidebarProps {
  groups: DocsGroup[];
  currentPath?: string | null;
  label?: string;
  className?: string;
}

export function DocsSidebar({ groups, currentPath, label = 'Documentation', className }: DocsSidebarProps) {
  const c = docsSidebarClasses(className);
  return (
    <nav aria-label={label} className={c.nav}>
      {groups.map((g) => (
        <div key={g.title} className={c.group}>
          <p className={c.title}>{g.title}</p>
          <ul role="list" className={c.list}>
            {g.links.map((l) => {
              const current = isCurrent(l.href, currentPath);
              return (
                <li key={l.href}>
                  <a href={l.href} className={c.link} aria-current={current ? 'page' : undefined} data-current={current ? '' : undefined}>
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
