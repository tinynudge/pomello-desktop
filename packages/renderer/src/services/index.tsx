import { ServiceRegistry } from '@domain';
import createMockService from './mock';
import createZenService from './zen';

const services: ServiceRegistry = {
  [createMockService.id]: createMockService,
  [createZenService.id]: createZenService,
};

export default services;
