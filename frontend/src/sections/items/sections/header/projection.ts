// From the generated sanity.ts of this section (the GROQ projection only, so the site needs no `sanity` package).
/** GROQ projection: a stored headerSection block → HeaderContent (types.ts), ready to spread into <Header />. */
export const headerSectionProjection = `{ _type, _key, variant, tone, brand{ name, "logo": logo{ "src": asset->url, "alt": coalesce(alt, ""), "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }, href }, links[]{ _key, label, href }, actions[]{ _key, label, href, emphasis } }`;
