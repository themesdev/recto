// An API page's endpoints (../shared.ts): method and path, each a link to its heading on the page.
import { endpointListClasses, type DocsEndpoint } from '../shared';

export interface EndpointListProps {
  endpoints: DocsEndpoint[];
  label?: string;
  className?: string;
}

export function EndpointList({ endpoints, label = 'Endpoints', className }: EndpointListProps) {
  const c = endpointListClasses(className);
  return (
    <ul role="list" aria-label={label} className={c.list}>
      {endpoints.map((e) => (
        <li key={e.id}>
          <a href={`#${e.id}`} className={c.link}>
            <span className={c.method(e.method.toLowerCase())}>{e.method.toUpperCase()}</span>
            <span className={c.path}>{e.path}</span>
            <span className={c.title}>{e.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
