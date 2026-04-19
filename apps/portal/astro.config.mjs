// @ts-check
import { defineConfig } from 'astro/config';

/**
 * gov.gh root portal — static output for Cloudflare Pages.
 *
 * Zero JavaScript on the page by default. Islands are permitted for
 * interactive surfaces in later roadmap steps, but every page must still
 * work without JavaScript per `.claude/CLAUDE.md §1`.
 */
export default defineConfig({
  output: 'static',
  site: 'https://gov.gh',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  // Prefetch intentionally disabled in PR 3 — only one page exists.
  // Re-enable with defaultStrategy: 'hover' when ministries/ lands.
  prefetch: false,
  devToolbar: {
    enabled: false,
  },
  vite: {
    build: {
      cssMinify: 'esbuild',
    },
  },
});
