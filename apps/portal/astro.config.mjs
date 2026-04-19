// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
  integrations: [
    sitemap({
      // Exclude generated internal Pagefind assets + the 404 page.
      filter: (page) => !page.includes('/pagefind/') && !page.endsWith('/404/'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          tw: 'tw',
        },
      },
    }),
  ],
  // Hover-prefetch is safe now that dozens of pages exist. Faster nav; no
  // preload noise because limit is 1 inflight prefetch per hover.
  prefetch: {
    defaultStrategy: 'hover',
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    build: {
      cssMinify: 'esbuild',
    },
  },
});
