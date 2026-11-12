// Sanity clients for the server: one for published content (through the CDN, cached by Next), one with the read token
// for draft mode (drafts, never cached).
import 'server-only';
import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from './env';
import { readToken } from './token';

export const client = createClient({ projectId: projectId || 'unset', dataset, apiVersion, useCdn: true, perspective: 'published' });

export const previewClient = client.withConfig({ token: readToken, useCdn: false, perspective: 'drafts', ignoreBrowserTokenWarning: true });
