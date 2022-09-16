import { Service } from './Service';
import { ServiceConfig } from './ServiceConfig';
import { ServiceConfigStore } from './ServiceConfigStore';
import { Translate } from './Translate';

interface ServiceFactoryOptions<TConfig> {
  config: TConfig extends void ? null : ServiceConfig<TConfig>;
  translate: Translate;
}

export interface ServiceFactory<TConfig = void> {
  (options: ServiceFactoryOptions<TConfig>): Service;
  config?: ServiceConfigStore<TConfig>;
  displayName: string;
  id: string;
}
