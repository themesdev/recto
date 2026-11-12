// Which Sanity project and dataset the site reads. Only these two are public (NEXT_PUBLIC_): they are not secret, and
// the browser needs them in draft mode. Tokens never get the NEXT_PUBLIC_ prefix: see ./token.ts.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
/** The Content Lake API version this theme's queries are written for (a date; change it only on purpose). */
export const apiVersion = '2026-10-01';
