// Imports the demo content into your Sanity dataset: the Site document, the five pages (as page-builder blocks), the
// seven posts with their bodies and authors, and every image in them as a Sanity asset.
//   pnpm seed            needs NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_API_WRITE_TOKEN
//                        (in .env.local, or in the environment). README › Set up Sanity.
// Safe to run again: documents keep their ids and are replaced; an image already uploaded is reused (Sanity
// recognises the same file). It never deletes anything else in the dataset.
import { readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error('seed: set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN (an Editor token from sanity.io/manage › API › Tokens) in .env.local');
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: '2026-10-01', useCdn: false });

const documents = JSON.parse(readFileSync(join(root, 'seed/documents.json'), 'utf8'));
const assets = JSON.parse(readFileSync(join(root, 'seed/assets.json'), 'utf8'));

// 1. Upload every image (public/<path>) and note its asset id.
const ids = new Map();
for (const a of assets) {
  const file = readFileSync(join(root, 'public', a.path));
  const doc = await client.assets.upload('image', file, { filename: basename(a.path), contentType: a.path.endsWith('.svg') ? 'image/svg+xml' : undefined });
  ids.set(a.ref, doc._id);
  process.stdout.write(`seed: image ${a.path}\n`);
}

// 2. Point the references at them.
const swap = (v) => {
  if (Array.isArray(v)) return v.map(swap);
  if (v && typeof v === 'object') {
    if (typeof v._ref === 'string' && v._ref.startsWith('seed-image:')) {
      const id = ids.get(v._ref);
      if (!id) throw new Error(`seed: no upload for ${v._ref}`);
      return { _type: 'reference', _ref: id };
    }
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, swap(x)]));
  }
  return v;
};

// 3. Write the documents in one transaction (posts first: pages may refer to them).
const order = (d) => (d._type === 'post' ? 0 : 1);
const tx = client.transaction();
for (const d of [...documents].sort((a, b) => order(a) - order(b))) tx.createOrReplace(swap(d));
await tx.commit({ visibility: 'sync' });
console.log(`seed: ${documents.length} documents and ${assets.length} images in ${projectId}/${dataset}. Open the Studio (pnpm studio) to edit them.`);
