import { Service } from './Service';
import { ServiceConfig } from './ServiceConfig';

export type ActiveService<TConfig = void> = {
  service: Service;
  config: ServiceConfig<TConfig> | null;
};
