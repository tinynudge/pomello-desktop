import { ServiceFactory } from '@domain';
import TrelloAuthView from './TrelloAuthView';
import { TrelloConfig } from './TrelloConfig';
import TrelloInitializingView from './TrelloInitializingView';

const createTrelloService: ServiceFactory<TrelloConfig> = ({ config }) => {
  return {
    displayName: createTrelloService.displayName,
    fetchTasks: () => Promise.resolve([]),
    id: createTrelloService.id,
    AuthView: TrelloAuthView,
    InitializingView: TrelloInitializingView,
  };
};

createTrelloService.displayName = 'Trello';
createTrelloService.id = 'trello';

createTrelloService.config = {
  defaults: {},
  schema: {
    type: 'object',
    properties: {
      token: { type: 'string', nullable: true },
    },
  },
};

export default createTrelloService;
