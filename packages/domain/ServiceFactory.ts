import { Service } from './Service';
import { ServiceConfig } from './ServiceConfig';

export interface ServiceFactory<TConfig = void> {
  (): Service;
  config?: ServiceConfig<TConfig>;
  displayName: string;
  id: string;
}
