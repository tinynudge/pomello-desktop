import type { ServiceFactory } from './ServiceFactory';

export type ServiceRegistry = Record<string, ServiceFactory>;
