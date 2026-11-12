// OpenNext for Cloudflare (pnpm deploy:cf): pages rebuilt by ISR are kept in the R2 bucket named in wrangler.jsonc.
// A stale page is rebuilt in the background through the memory queue, which calls this worker again over the
// WORKER_SELF_REFERENCE service binding (wrangler.jsonc).
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import memoryQueue from '@opennextjs/cloudflare/overrides/queue/memory-queue';

export default defineCloudflareConfig({ incrementalCache: r2IncrementalCache, queue: memoryQueue });
