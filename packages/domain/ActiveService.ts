import type { Service } from './Service';
import type { ServiceConfig } from './ServiceConfig';

export interface ActiveService<TConfig = void> {
  service: Service;
  config: ServiceConfig<TConfig> | null;
}
