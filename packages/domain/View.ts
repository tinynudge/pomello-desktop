import type { ComponentType, SvelteComponent } from 'svelte';

export type View<TProps extends Record<string, unknown> = Record<string, unknown>> = {
  additionalProps?: Record<string, unknown>;
  component: ComponentType<SvelteComponent<TProps>>;
};
