# Recto: a blog template for Next.js and Sanity

A free, open-source blog template for writers, studios and small teams who publish essays. Posts and pages are edited in
Sanity Studio, with live preview in the Presentation tool. The site is a Next.js app that is generated ahead of time
and refreshes itself when you publish.

The look is a page set for reading. Literata is used for the titles and the post body, and Instrument Sans for
everything around them. Text is ink on warm white, with one vermilion accent and hairline rules. Dark mode follows the
reader's system setting.

The demo is an invented journal, **Low Season**, written by three invented people. Every name, essay and figure in it
is made up.

**Demo:** [recto.themes.dev](https://recto.themes.dev)

Made by [themes.dev](https://www.themes.dev/?utm_source=sanity-templates&utm_medium=referral&utm_campaign=recto), where you'll
find more themes for Next.js, Sanity and Astro.

## What you get

- **Pages**: a home page with a poster headline, the newest posts (one large, three beside it) and an archive list; an
  essay archive with pagination; an about page; a privacy page; a thank-you page; and a 404.
- **Posts**: a large title on the reading column, a byline, a cover, a body with headings, lists, quotes, links, images
  with captions, tables and code (highlighted on the server, with an optional file name), the author's bio, and three
  more posts below.
- **A page builder** in the Studio with nine sections: hero, page header, posts, content, split, media, team,
  newsletter and call to action. Each section has layouts and tones (the page ground, a quiet band, or inverse). Posts
  sections left empty show the newest posts.
- **Newsletter sign-up** that works without JavaScript and forwards each address as JSON to your email service, with a
  honeypot for bots.
- **SEO**: titles and descriptions, canonical links, Open Graph images drawn for every page and post, JSON-LD
  (website, organisation, blog posts, breadcrumbs), a sitemap, robots.txt, an RSS feed, `llms.txt` and every post as
  Markdown.
- **Speed and access**: server components throughout, self-hosted fonts that don't shift the layout, and no client
  JavaScript except the mobile menu and the announcement's close button. Text contrast is AA in light and dark.
- **Deploys** to Vercel, or to Cloudflare Workers through OpenNext.

## Start

The quickest way is Sanity's CLI. It copies this repository, creates (or picks) a Sanity project and a dataset, makes
a read token and a write token, adds `http://localhost:3000` to the project's CORS origins, and writes
`frontend/.env.local` and `studio/.env` for you:

```sh
npm create sanity@latest -- --template themesdev/recto
```

Then, in the new folder:

```sh
pnpm seed         # import the demo journal into your dataset
pnpm dev          # the site on http://localhost:3000 and the Studio on http://localhost:3333
```

After the seed, remove `SANITY_API_WRITE_TOKEN` from `frontend/.env.local`: the site never needs it.

You can also press **Use this template** on [GitHub](https://github.com/themesdev/recto) (or clone the repository) and follow
[Set up Sanity](#set-up-sanity) below.

## Quick look

You need Node.js 22.12 or newer and pnpm (`npm install -g pnpm`).

```sh
pnpm install
pnpm dev:next     # http://localhost:3000
```

Until you connect a Sanity project, the site shows the demo content from `frontend/seed/`. It reads that content with
the same GROQ queries it uses against Sanity, through `groq-js`. This is for a first look only: a production build
needs a Sanity project, and stops with a message when there is none. To build the demo content anyway (for a static
preview of the design), set `SANITY_FIXTURE=1`:

```sh
SANITY_FIXTURE=1 pnpm build
```

## Set up Sanity

Sanity's free plan is enough. It takes about ten minutes.

1. **Create a project.** Sign in at [sanity.io/manage](https://www.sanity.io/manage), choose *Create new project* and
   pick the Free plan. Note the **project ID**. Create a dataset called `production` with **public** visibility.
   Published content is then read without a token, and drafts stay private either way.
2. **Tokens.** In the project, go to *API › Tokens › Add API token*. Create one with **Editor** rights (for the
   import in step 4) and one with **Viewer** rights (for the preview).
3. **Settings.**
   - Copy `frontend/.env.example` to `frontend/.env.local`. Fill in `NEXT_PUBLIC_SANITY_PROJECT_ID`,
     `SANITY_API_WRITE_TOKEN` (the Editor token) and `SANITY_API_READ_TOKEN` (the Viewer token).
   - Copy `studio/.env.example` to `studio/.env` and fill in `SANITY_STUDIO_PROJECT_ID`.
4. **Import the demo content:**

   ```sh
   pnpm seed
   ```

   This uploads the demo drawings and writes the Site document, three pages and eight posts. Running it again
   replaces them and touches nothing else. Afterwards, remove `SANITY_API_WRITE_TOKEN` from `frontend/.env.local`,
   because the site never needs it.
5. **CORS.** In the project, go to *API › CORS origins* and add `http://localhost:3333` with *Allow credentials*. This
   is the Studio on your computer.
6. **Run both:**

   ```sh
   pnpm dev          # the site on http://localhost:3000 and the Studio on http://localhost:3333
   ```

### Publish without waiting

A published change shows on the site within a minute. To show it at once, add a webhook in the project under *API ›
Webhooks › Create webhook*:

- URL: `https://<your-site>/api/revalidate/`
- Trigger: create, update and delete
- Filter: `_type in ["page", "post", "siteSettings"]`
- HTTP method: POST, with a secret

Put the same secret in `SANITY_REVALIDATE_SECRET` where the site runs.

## Editing in the Studio

- **Site** (one document): the announcement bar, the header (name, navigation, button), the footer (link columns,
  feed, legal line) and the organisation behind the site, for search engines.
- **Pages**: each page has a title, a path, a description and its **Sections**. You can add, remove and reorder
  sections. Each one has a *Layout* and a *Tone*. Give a section an **Anchor** to link to it: the newsletter's anchor
  `newsletter` makes the header's *Subscribe* button jump to `/#newsletter`.
- **Posts**: title, slug, date, excerpt, cover, author (name, photo, role, bio), up to three tags, and the body.

| Address | Page document (slug) | Notes |
|---|---|---|
| `/` | `home` | its title is used in full |
| `/blog/` | `blog` | its first section (the page header), then the posts, then its other sections |
| `/blog/<slug>/` | a post | with three more posts and the blog page's newsletter section |
| `/about/` | `about` | |
| `/privacy/`, `/thanks/`, 404 | files in `frontend/src/app/` | the privacy page holds a sample text for the demo journal |

To add a page at another address, copy `frontend/src/app/about/page.tsx` to `frontend/src/app/<address>/page.tsx`,
change the slug and path in it, and create the page document with that slug.

**Preview.** The Studio's *Presentation* tool shows the site next to the form, with your unpublished drafts, and it
refreshes as you type. It needs three settings:

- `SANITY_API_READ_TOKEN` on the site;
- `SANITY_STUDIO_PREVIEW_URL` in `studio/.env`, set to the site's address;
- `SANITY_STUDIO_URL` on the site, set to the Studio's address. That is the only site allowed to show yours in a frame.

**The privacy page** is a sample written for the demo journal, not legal advice. A note at the top says so while the
page passes `isSample`. Rewrite it for your own site, have it checked, then remove `isSample`.

## What's where

```
studio/                   Sanity Studio (its own app in this workspace)
  sanity.config.ts        the Studio: structure, Presentation, Vision
  schema/                 generated/ (sections, pages, posts, Site) plus this template's additions in index.ts
frontend/                 the Next.js site
  src/app/                one folder per address, plus the feed, sitemap, robots, Open Graph images and API routes
  src/components/         the site layout, the blog index, the legal page shell, JSON-LD
  src/lib/                content.ts (what pages read), queries.ts (GROQ), latest.ts (empty Posts sections),
                          data/ (Sanity fetch and the demo fixture), forms.ts, seo.ts, og/
  src/sections/           the sections (React), their parts, and the page builder
  src/styles/             global.css, presets/recto.css (every colour, font and size), fonts/, prose.css
  seed/                   the demo content in Sanity's format (pnpm seed imports it)
  public/images/          the demo drawings and avatars: replace them with your own
  tests/                  the form handler, and every query run against the demo content
```

## Customising the look

Everything the site draws comes from the custom properties in `frontend/src/styles/presets/recto.css`:

- **Colours**: `--background`, `--foreground`, `--muted-foreground`, `--card`, `--border`, `--border-strong`,
  `--input`, `--primary` (links and the main button), `--primary-foreground`, `--primary-soft`,
  `--primary-soft-foreground`, `--destructive`, `--ring`. The `:root` block holds the light values and the dark blocks
  the dark ones. `[data-tone='muted']` and `[data-tone='inverse']` hold the bands.
- **Type**: `--font-sans`, `--font-heading`, `--font-mono`, and one scale from `--text-size-sm` to
  `--text-size-display`, with line heights, weights and letter-spacing next to it. The post body uses
  `--font-heading` and the column width `--measure` (in `prose.css`).
- **Space and shape**: `--space-section`, `--space-gap`, `--size-container`, `--radius-card`, `--radius-button`.
- **Phones**: the `@media (width < 40rem)` block.

Keep text at 4.5:1 contrast against its background. Use the token classes in your own markup (`bg-card`,
`text-muted-foreground`, `rounded-card`, `text-size-lg`). Tailwind's own palette and type scale are switched off on
purpose, and `pnpm lint` checks this.

After changing colours, run `pnpm draw-demo` so the demo drawings follow, then `pnpm seed` to upload them again. Or
replace them with your own images in the Studio.

**Fonts** are self-hosted with `next/font/local` from Fontsource (SIL Open Font License). To change one, install its
package (`pnpm --filter recto-frontend add @fontsource-variable/<name>`), point the `src` in
`frontend/src/styles/fonts/recto.ts` at its woff2 file, and update the stack in the preset.

**Dark mode** follows the system setting. To force one mode, set `data-theme="light"` or `data-theme="dark"` on
`<html>` in `frontend/src/app/layout.tsx`.

## The newsletter form

The sign-up posts to `/api/newsletter/`, handled by `frontend/src/lib/forms.ts`:

- The address goes as JSON to **`FORWARD_URL`**: your email service's API, an automation tool or a webhook. The
  visitor then sees `/thanks/`.
- Without `FORWARD_URL` the form **fails closed**: it answers 503 and accepts nothing. The log names the form, never
  the address.
- A hidden honeypot field, `company_website`, catches bots. A submission with it filled gets the normal answer and is
  dropped.

To use a newsletter provider's own form instead, set the section's *Form action* to its URL and add that origin to
`form-action` in the Content-Security-Policy in `frontend/next.config.ts`.

## Deploy

Set these where the site runs (see `frontend/.env.example`):

| Variable | | |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | public | your project |
| `SITE_URL` | | the site's address, for canonical links, sitemap, feed and Open Graph images |
| `SANITY_API_READ_TOKEN` | secret | the preview (drafts) |
| `SANITY_REVALIDATE_SECRET` | secret | the publish webhook |
| `SANITY_STUDIO_URL` | | your Studio's address, allowed to frame the site |
| `FORWARD_URL` | secret | where newsletter sign-ups go |

**Studio.** Run `pnpm studio:deploy` for Sanity's free hosting (`https://<name>.sanity.studio`). Set
`SANITY_STUDIO_PREVIEW_URL` in `studio/.env` to the live site first.

**Vercel.** Import the repository and set the *Root Directory* to `frontend`. Add the variables under *Settings ›
Environment Variables*.

**Cloudflare Workers (OpenNext).** `frontend/wrangler.jsonc` and `frontend/open-next.config.ts` are ready. Once:

```sh
cd frontend
npx wrangler r2 bucket create recto-site-opennext-cache
npx wrangler secret put SANITY_API_READ_TOKEN      # and FORWARD_URL, SANITY_REVALIDATE_SECRET
```

Put the public settings under `vars` in `wrangler.jsonc`, and export them in the shell for the build too. Then run
`pnpm deploy:cf`.

On Workers a stale page is rebuilt in the background (OpenNext's memory queue, through the `WORKER_SELF_REFERENCE`
binding), so a published change shows within a minute. The webhook's instant refresh needs a tag cache as well: see
[OpenNext's caching guide](https://opennext.js.org/cloudflare/caching) for the D1 tag cache.

## Security

- Only the project ID and dataset reach the browser. The read token is used only in server code
  (`frontend/src/lib/sanity/token.ts` is `server-only`), and the write token only by `pnpm seed`.
- The preview turns on only through the Studio, which signs each request with a one-time secret.
- A Content-Security-Policy allows scripts, styles and fonts from the site itself, images from the site and Sanity's
  CDN, forms to the site, and framing only by your Studio.

## Commands

Run them from the repository root.

| Command | |
|---|---|
| `pnpm dev` | the site and the Studio together |
| `pnpm dev:next` / `pnpm dev:studio` | one of them |
| `pnpm build` | production build of the site |
| `pnpm seed` | import the demo content into your dataset |
| `pnpm typecheck` | TypeScript for the site and the Studio |
| `pnpm lint` | ESLint and the template's design rules |
| `pnpm test` | the form handler, and every query run against the demo content |
| `pnpm draw-demo` | redraw the demo drawings in the preset's colours |
| `pnpm studio:deploy` | deploy the Studio to Sanity's hosting |
| `pnpm deploy:cf` | build and deploy the site to Cloudflare Workers |
| `pnpm validate` | check the repository against Sanity's template rules |

## License

MIT, see `LICENSE`. The fonts keep their own licenses (SIL Open Font License 1.1). The demo essays and drawings are
yours to replace.

Want more than a blog? [themes.dev](https://www.themes.dev/?utm_source=sanity-templates&utm_medium=referral&utm_campaign=recto)
has full site themes for Next.js and Sanity: a product site, a developer-tools site with docs, and an agency site.
