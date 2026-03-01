import { CreateFetchTaskNamesOptions } from './CreateFetchTaskNamesOptions';
import { FetchTaskNames } from './FetchTaskNames';
import { Service } from './Service';
import { ServiceConfigStore } from './ServiceConfigStore';
import { ServiceRuntime } from './ServiceRuntime';

export type ServiceFactory<TConfig = void> = {
  (runtime: ServiceRuntime<TConfig>): Service;
  config?: ServiceConfigStore<TConfig>;
  createFetchTaskNames?(options: CreateFetchTaskNamesOptions<TConfig>): FetchTaskNames;
  displayName: string;
  hasConfigureView: boolean;
  id: string;
};
