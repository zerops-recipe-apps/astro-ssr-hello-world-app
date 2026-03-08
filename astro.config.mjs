import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { readFileSync } from 'fs';

// Read the installed Astro version at build time (not the semver
// range from package.json, but the actual installed version).
const astroPkg = JSON.parse(
  readFileSync('./node_modules/astro/package.json', 'utf-8')
);

export default defineConfig({
  // SSR mode: Astro renders pages on the server per request.
  // 'server' disables static prerendering by default.
  output: 'server',

  adapter: node({
    // 'standalone' produces a self-contained Node.js server at
    // dist/server/entry.mjs - no separate HTTP server needed.
    mode: 'standalone',
  }),

  vite: {
    define: {
      // Build-time constants replaced at compile time via Vite.
      // Access in .astro frontmatter and .ts server files.
      __ASTRO_VERSION__: JSON.stringify(astroPkg.version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  },
});
