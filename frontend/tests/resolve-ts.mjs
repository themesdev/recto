// Lets `node --test` load the site's TypeScript, whose imports leave out the extension (as Next.js allows):
// a relative import that doesn't resolve is tried again with .ts and .tsx.
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (!specifier.startsWith('.')) throw error;
      for (const ext of ['.ts', '.tsx', '/index.ts']) {
        try {
          return next(specifier + ext, context);
        } catch {}
      }
      throw error;
    }
  },
});
