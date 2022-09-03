import { Service } from './Service';
import { ServiceConfig } from './ServiceConfig';

export interface ActiveService<TConfig = void> {
  service: Service;
  config: ServiceConfig<TConfig> | null;
}
