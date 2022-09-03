import { ServiceRegistry } from '@domain';
import createMockService from './mock';
import createTrelloService from './trello';
import createZenService from './zen';

const services = {
  [createMockService.id]: createMockService,
  [createTrelloService.id]: createTrelloService,
  [createZenService.id]: createZenService,
} as ServiceRegistry;

export default services;
