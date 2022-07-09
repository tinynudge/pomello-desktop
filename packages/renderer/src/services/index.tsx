import { ServiceRegistry } from '@domain';
import createMockService, { mockServiceId } from './mock';

const services: ServiceRegistry = {
  [mockServiceId]: createMockService,
};

export default services;
