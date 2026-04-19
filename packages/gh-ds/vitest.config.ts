import { defineConfig } from 'vitest/config';

/**
 * Back to a plain vitest config. Button tests render the component by
 * driving Astro's container from inside the test (via a small dynamic
 * import helper) rather than importing the .astro file directly. This
 * sidesteps vitest's need for a vite plugin that understands .astro syntax
 * and keeps contrast.test.ts (pure TS) running fast.
 */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    reporters: ['default'],
  },
});
