/**
 * @gh/gh-ds — components barrel.
 *
 * Astro components cannot be re-exported from a .ts barrel — consumers import
 * them directly via the package exports map (e.g. `@gh/gh-ds/Button`). This
 * file exists so future non-Astro helpers (action-pattern utilities, typed
 * prop contracts) have a stable export surface.
 */

export {};
