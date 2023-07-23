import type { ServiceRegistry } from '@domain';
import createMockService from './mock';

const services = {
  [createMockService.id]: createMockService,
} as ServiceRegistry;

export default services;
