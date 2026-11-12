// The Studio: Site (one document: announcement bar, header, footer, organisation), Pages (built from sections) and
// Posts, the Presentation tool (the site beside the form, with drafts) and Vision (try GROQ queries).
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schema';
import { structure } from './structure';
import { locations, mainDocuments } from './presentation';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
/** The site, for the Presentation tool: http://localhost:3000 while you work, your live address once deployed. */
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000';

export default defineConfig({
  name: 'recto',
  title: 'Recto',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: { initial: previewUrl, previewMode: { enable: '/api/draft-mode/enable/', disable: '/api/draft-mode/disable/' } },
      allowOrigins: [previewUrl],
      resolve: { locations, mainDocuments },
    }),
    visionTool({ defaultApiVersion: '2026-10-01' }),
  ],
  document: {
    // The Site document is a singleton: no "new" or "delete" for it.
    newDocumentOptions: (prev) => prev.filter((t) => t.templateId !== 'siteSettings'),
    actions: (prev, { schemaType }) => (schemaType === 'siteSettings' ? prev.filter((a) => !['delete', 'duplicate', 'unpublish'].includes(a.action ?? '')) : prev),
  },
});
