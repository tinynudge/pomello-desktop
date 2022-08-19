import { ServiceRegistry } from '@domain';
import createMockService from './mock';

const services: ServiceRegistry = {
  [createMockService.id]: createMockService,
};

export default services;
