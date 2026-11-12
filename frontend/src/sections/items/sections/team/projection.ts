// From the generated sanity.ts of this section (the GROQ projection only, so the site needs no `sanity` package).
/** GROQ projection: a stored teamSection block → TeamContent (types.ts), ready to spread into <Team />. */
export const teamSectionProjection = `{ _type, _key, variant, tone, spacing, rules, eyebrow, heading, lead, people[]{ _key, name, role, "avatar": avatar{ "src": asset->url, "alt": coalesce(alt, ""), "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }, links[]{ _key, label, href } }, link{ label, href } }`;
