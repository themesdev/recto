// Ultra-wide safe images (sections that bleed to the window: hero overlay, case-header cover, split bleed).
// - srcset to 3840 with an honest sizes: an image's own srcset, else widths built for a Sanity CDN URL (?w=), else none
//   (a local SVG scales; a single raster is sent as it is).
// - the drawn width stops at size.bleed (2560px): sizes says so, and sections.css › s-bleed turns the image into a
//   frame on the section's ground past it.
// - imageFocus: the crop keeps the subject (object-position), from the editor's choice.
import type { CSSProperties } from 'react';
import type { ImageRef } from '../kinds';

export const BLEED_WIDTHS = [640, 960, 1280, 1920, 2560, 3840] as const;

/** An image that may carry its own srcset (a theme's build, an image service): ImageRef.srcset. */
export type ResponsiveImage = ImageRef;

/** The srcset for an image drawn up to the widest bleed, or undefined when there is nothing better to offer. */
export function bleedSrcset(image: ResponsiveImage, widths: readonly number[] = BLEED_WIDTHS): string | undefined {
  if (image.srcset) return image.srcset;
  if (/^https:\/\/cdn\.sanity\.io\//.test(image.src)) {
    const join = image.src.includes('?') ? '&' : '?';
    return widths.map((w) => `${image.src}${join}w=${w}&fit=max&auto=format ${w}w`).join(', ');
  }
  return undefined;
}

/** sizes for each bleed: what the browser will actually draw, capped at size.bleed. */
export const BLEED_SIZES = {
  // The whole window, up to 2560px.
  full: '(min-width: 2560px) 2560px, 100vw',
  // split › bleed: about seven twelfths of the container plus the space beside it, up to size.bleed-screen (1920px).
  split: '(min-width: 1920px) 1060px, (min-width: 1024px) 60vw, 100vw',
} as const;

/** The nine crop anchors an editor can pick. */
export const FOCUSES = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'] as const;
export type Focus = (typeof FOCUSES)[number];

/** object-position for a focus (undefined for the centre, the browser's default). */
export const focusStyle = (focus?: Focus | string | null): CSSProperties | undefined => (focus && focus !== 'center' ? { objectPosition: focus } : undefined);

// Every other image the library renders (retina-blurry): sharp on a 2× and 3× screen, never wider than needed.
// - the image's own srcset when it has one (a theme's pipeline: "a-1x.webp 1x, a.webp 2x" or widths), as it is. No @ in
//   a file name: Cloudflare's static assets answer a@2x.webp with a 307 to a%402x.webp, a redirect per image (the
//   kit's release check flags it);
// - else, for a Sanity CDN URL, widths up to the image's own width (never upscaled);
// - else nothing: a single local file is sent as it is (a theme ships its 2× file and gets a sharp, if heavier, image).
// sizes says how wide the slot is drawn, so a 2× screen picks twice that; it only counts with width descriptors. An
// image's own sizes (ImageRef.sizes) wins: a theme whose container or tiles are wider than SIZES says sets it.
export const CONTENT_WIDTHS = [160, 320, 480, 640, 960, 1280, 1600, 1920, 2400] as const;

/** How wide each kind of slot is drawn, at most (the container is size.container, 1200px). */
export const SIZES = {
  // Across the container: a stacked hero's image, the panel's screen, media, a stacked gallery, a featured cover.
  container: '(min-width: 1200px) 1200px, 100vw',
  // Half the container: split, a split hero, two-column grids, the bento lead, steps with an image.
  half: '(min-width: 1024px) 600px, 100vw',
  // A third: three-column cards that go two-up from 640px (featured posts).
  third: '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
  // A third that is one column below 1024px: the footer's visual, a posts grid (md:grid-cols-3 is a third from 768px).
  thirdStacked: '(min-width: 1024px) 400px, 100vw',
  // Two of three columns: the features bento lead.
  twoThirds: '(min-width: 1024px) 800px, 100vw',
  // A quarter: team portraits.
  quarter: '(min-width: 1024px) 300px, 50vw',
  // The reading column of an article.
  prose: '(min-width: 720px) 720px, 100vw',
  // Small fixed images: avatars, a logo.
  avatar: '80px',
  logo: '240px',
} as const;
export type Slot = keyof typeof SIZES;

/** The srcset for an image in a slot, or undefined when there is nothing better than src. */
export function imageSrcset(image: ResponsiveImage, widths: readonly number[] = CONTENT_WIDTHS): string | undefined {
  if (image.srcset) return image.srcset;
  if (/^https:\/\/cdn\.sanity\.io\//.test(image.src)) {
    const join = image.src.includes('?') ? '&' : '?';
    const max = image.width > 0 ? image.width : Infinity;
    const list = [...widths.filter((w) => w < max), ...(max < Infinity ? [max] : [])];
    return list.map((w) => `${image.src}${join}w=${w}&fit=max&auto=format ${w}w`).join(', ');
  }
  return undefined;
}

/** srcset and sizes for an Astro <img> (spread after src): nothing when there is no srcset. */
export function srcsetAttrs(image: ResponsiveImage, slot: Slot): { srcset?: string; sizes?: string } {
  const srcset = imageSrcset(image);
  if (!srcset) return {};
  return / \d+w(,|$)/.test(srcset) ? { srcset, sizes: image.sizes || SIZES[slot] } : { srcset };
}

/** The same for a React <img> (srcSet). */
export function srcSetProps(image: ResponsiveImage, slot: Slot): { srcSet?: string; sizes?: string } {
  const { srcset, sizes } = srcsetAttrs(image, slot);
  return srcset ? (sizes ? { srcSet: srcset, sizes } : { srcSet: srcset }) : {};
}
