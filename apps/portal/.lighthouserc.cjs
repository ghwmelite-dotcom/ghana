/**
 * Lighthouse CI budget — verbatim from `.claude/CLAUDE.md §8`.
 *
 * Runs against `pnpm preview` in CI. Every assertion below is a merge blocker.
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm preview --port 4321',
      startServerReadyPattern: 'Local',
      url: ['http://localhost:4321/'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttlingMethod: 'simulate',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interaction-to-next-paint': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-byte-weight': ['error', { maxNumericValue: 307200 }],
        'unused-javascript': ['error', { maxNumericValue: 20000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
