// A Posts section left empty in the Studio shows the newest posts: four for Featured (one large, three beside it),
// three for Grid, six for List. Sections with posts picked by hand keep them. Sections later on the page continue
// after the posts above them, so a Featured section followed by an empty List shows posts 1–4, then 5–10.
// Every Posts section also links its posts with the trailing slash the site's addresses have (/blog/<slug>/).
import 'server-only';
import type { Block } from './content';
import { getPosts } from './content';

const COUNT = { featured: 4, grid: 3, list: 6 } as const;

export async function fillLatest(sections: Block[] | null | undefined, preview = false): Promise<Block[]> {
  const blocks = sections ?? [];
  const empty = blocks.filter((b) => b._type === 'postsSection' && !b.posts?.length);
  const slash = (b: Block) => (b._type === 'postsSection' ? ({ ...b, trailingSlash: true } as Block) : b);
  if (!empty.length) return blocks.map(slash);
  const want = empty.reduce((n, b) => n + COUNT[(b._type === 'postsSection' && b.variant) || 'grid'], 0);
  const posts = await getPosts(0, want, preview);
  let at = 0;
  return blocks.map((b) => {
    if (b._type !== 'postsSection' || b.posts?.length) return slash(b);
    const n = COUNT[b.variant ?? 'grid'];
    const filled = { ...b, posts: posts.slice(at, at + n) };
    at += n;
    return slash(filled);
  });
}
