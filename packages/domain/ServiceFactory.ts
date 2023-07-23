import type { Service } from './Service';
import type { ServiceConfigStore } from './ServiceConfigStore';
import type { ServiceRuntime } from './ServiceRuntime';

export interface ServiceFactory<TConfig = void> {
  (runtime: ServiceRuntime<TConfig>): Service;
  config?: ServiceConfigStore<TConfig>;
  displayName: string;
  id: string;
}
