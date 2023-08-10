import '@testing-library/jest-dom';
import { vi } from 'vitest';

beforeAll(() => {
  // Since tests are running in a Node environment, it uses the "node" exports
  // from Svelte which point to the SSR import path. For SSR, life cycle methods
  // do not run and are exported as a noop.
  // https://github.com/testing-library/svelte-testing-library/issues/222#issuecomment-1588987135
  vi.mock('svelte', async () => {
    const actual = (await vi.importActual('svelte')) as object;
    return {
      ...actual,
      onMount: (await import('svelte/internal')).onMount,
    };
  });
});
