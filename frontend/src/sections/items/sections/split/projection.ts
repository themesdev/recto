// From the generated sanity.ts of this section (the GROQ projection only, so the site needs no `sanity` package).
/** GROQ projection: a stored splitSection block → SplitContent (types.ts), ready to spread into <Split />. */
export const splitSectionProjection = `{ _type, _key, variant, tone, spacing, rules, eyebrow, heading, lead, points, actions[]{ _key, label, href, emphasis }, "image": image{ "src": asset->url, "alt": coalesce(alt, ""), "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }, imageFocus }`;
