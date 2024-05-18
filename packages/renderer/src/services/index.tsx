import { ServiceRegistry } from '@pomello-desktop/domain';
import { createMockService } from './mock';
import { createTrelloService } from './trello';
import { createZenService } from './zen';

export const services = {
  [createMockService.id]: createMockService,
  [createTrelloService.id]: createTrelloService,
  [createZenService.id]: createZenService,
} as ServiceRegistry;
