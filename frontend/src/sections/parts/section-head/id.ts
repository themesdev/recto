/** A stable id for a section's heading, so the section can be labelled by it: from the section's id, or else from the
 *  heading text. The same in Astro, React and on the server (no counter, no useId). */
export const headingId = (heading: string, id?: string | null) =>
  `${id ?? heading.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48)}-title`;
