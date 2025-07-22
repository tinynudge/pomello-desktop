import { ParentComponent } from 'solid-js';

export type ServiceContainer<TProps extends Record<string, unknown> = Record<string, unknown>> =
  ParentComponent<TProps>;
