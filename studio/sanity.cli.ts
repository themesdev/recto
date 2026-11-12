import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: { projectId: process.env.SANITY_STUDIO_PROJECT_ID, dataset: process.env.SANITY_STUDIO_DATASET || 'production' },
  // `pnpm studio:deploy` publishes the Studio at https://<studioHost>.sanity.studio. Set SANITY_STUDIO_HOST or answer the prompt.
  studioHost: process.env.SANITY_STUDIO_HOST,
  // Auto-updates off: the Studio runs the exact sanity version in package.json, the one this theme was tested with.
  deployment: { autoUpdates: false },
});
