import { CacheProvider } from '@/shared/context/CacheContext';
import createCache from '@/shared/helpers/createCache';
import { ServiceFactory } from '@domain';
import { TrelloCache } from './domain';
import TrelloAuthView from './TrelloAuthView';
import trelloClient from './trelloClient';
import { TrelloConfig } from './domain/TrelloConfig';
import TrelloInitializingView from './TrelloInitializingView';

const createTrelloService: ServiceFactory<TrelloConfig> = ({ config }) => {
  trelloClient.interceptors.request.use(requestConfig => {
    const { token } = config.get();

    if (token) {
      requestConfig.params.token = window.app.decryptValue(token);
    }

    return requestConfig;
  });

  const cache = createCache<TrelloCache>();

  return {
    Container: ({ children }) => <CacheProvider cache={cache}>{children}</CacheProvider>,
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
      currentList: { type: 'string', nullable: true },
      listFilter: { type: 'string', nullable: true },
      listFilterCaseSensitive: { type: 'boolean', nullable: true },
      token: { type: 'string', nullable: true },
      preferences: { type: 'object', nullable: true },
      recentLists: { type: 'array', items: { type: 'string' }, nullable: true },
    },
  },
};

export default createTrelloService;
