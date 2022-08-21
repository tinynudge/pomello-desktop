import { Service } from './Service';
import { ServiceConfig } from './ServiceConfig';
import { ServiceConfigStore } from './ServiceConfigStore';

interface ServiceFactoryOptions<TConfig> {
  config: TConfig extends void ? null : ServiceConfig<TConfig>;
}

export interface ServiceFactory<TConfig = void> {
  (options: ServiceFactoryOptions<TConfig>): Service;
  config?: ServiceConfigStore<TConfig>;
  displayName: string;
  id: string;
}
