// Posts (item.json): blog posts as cards in a grid, a list of rows, or one large post above the rest (featured), with
// an optional link to all posts and the page links of a blog index (parts/pagination).
import { Icon } from '../../../../parts/icon/react/Icon';
import { Avatar } from '../../../../parts/avatar/react/Avatar';
import { Pagination } from '../../../../parts/pagination/react/Pagination';
import { SectionHead } from '../../../../parts/section-head/react/SectionHead';
import { headingId } from '../../../../parts/section-head/id';
import { spacingAttr, toneAttr } from '../../../../parts/kinds';
import type { PaginationInfo } from '../../../../parts/pagination/shared';
import { cn } from '../../../../recipes/cn';
import { formatDate, postHref, postsClasses, postImageSlot } from '../shared';
import { POSTS_DEFAULTS, type PostsContent } from '../types';
import { srcSetProps } from '../../../../parts/image/responsive';

export interface PostsProps extends PostsContent {
  pagination?: PaginationInfo | null;
  /** End card links in a slash (/blog/my-post/). Default false. */
  trailingSlash?: boolean;
  id?: string;
  className?: string;
}

export function Posts({ eyebrow, heading, lead, link, basePath, posts, variant, tone, spacing, rules, pagination, trailingSlash = false, id, className }: PostsProps) {
  const v = variant ?? POSTS_DEFAULTS.variant;
  const c = postsClasses(v, posts.length);
  const hid = heading ? headingId(heading, id) : undefined;
  const base = basePath ?? POSTS_DEFAULTS.basePath;
  const Title = heading ? 'h3' : 'h2';
  return (
    <section
      id={id}
      data-section="posts"
      data-variant={v}
      data-tone={toneAttr(tone)}
      data-spacing={spacingAttr(spacing)} data-rules={rules ? '' : undefined}
      aria-labelledby={hid}
      aria-label={hid ? undefined : 'Posts'}
      className={cn(c.root, className)}
    >
      <div className={c.inner}>
        {(heading && hid) || link ? (
          <div className={c.top}>
            {heading && hid ? <SectionHead eyebrow={eyebrow} heading={heading} lead={lead} headingId={hid} /> : null}
            {link ? (
              <a href={link.href} className={c.all}>
                {link.label}
                <Icon name="arrow-right" size={16} />
              </a>
            ) : null}
          </div>
        ) : null}
        <ul role="list" className={c.list}>
          {posts.map((p, i) => {
            const big = v === 'featured' && i === 0;
            return (
              <li key={p.slug} className={c.item(big)}>
                <article className={c.card(big)}>
                  {p.image ? (
                    <img src={p.image.src} {...srcSetProps(p.image, postImageSlot(v, posts.length, big))} alt="" width={p.image.width} height={p.image.height} className={c.image} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" />
                  ) : null}
                  <div className={c.body}>
                    <Title className={c.title(big)}>
                      <a href={postHref(base, p.slug, trailingSlash)} className={c.titleLink}>
                        {p.title}
                      </a>
                    </Title>
                    <div className={c.meta}>
                      <time dateTime={p.date}>{formatDate(p.date)}</time>
                      {p.tags?.length ? (
                        <ul role="list" aria-label="Tags" className={c.tags}>
                          {p.tags.map((t) => (
                            <li key={t} className={c.tag}>
                              {t}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    {p.excerpt ? <p className={c.excerpt(big)}>{p.excerpt}</p> : null}
                    {p.author ? (
                      <p className={c.author}>
                        <Avatar name={p.author.name} image={p.author.avatar} size="sm" />
                        <span className={c.authorName}>{p.author.name}</span>
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        {pagination ? <Pagination {...pagination} /> : null}
      </div>
    </section>
  );
}
