// From the generated sanity.ts of this section (the GROQ projection only, so the site needs no `sanity` package).
/** GROQ projection: a stored mediaSection block → MediaContent (types.ts), ready to spread into <Media />. */
export const mediaSectionProjection = `{ _type, _key, variant, tone, spacing, rules, eyebrow, heading, lead, "image": image{ "src": asset->url, "alt": coalesce(alt, ""), "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }, video, captions, caption, callouts[]{ _key, title, text, x, y }, markers }`;
