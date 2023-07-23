import type { SvelteComponent } from 'svelte';

export type ServiceContainer<TProps extends Record<string, unknown> = Record<string, unknown>> =
  SvelteComponent<TProps>;
