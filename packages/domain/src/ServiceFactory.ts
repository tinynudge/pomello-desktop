import { Service } from './Service';
import { ServiceConfigStore } from './ServiceConfigStore';
import { ServiceRuntime } from './ServiceRuntime';

export type ServiceFactory<TConfig = void> = {
  (runtime: ServiceRuntime<TConfig>): Service;
  config?: ServiceConfigStore<TConfig>;
  displayName: string;
  hasConfigureView: boolean;
  id: string;
};
