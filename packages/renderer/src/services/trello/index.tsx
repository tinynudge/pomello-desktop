import createCache from '@/shared/helpers/createCache';
import { ServiceFactory } from '@domain';
import { TrelloCache, TrelloConfig } from './domain';
import fetchTasks from './fetchTasks';
import TrelloAuthView from './TrelloAuthView';
import trelloClient from './trelloClient';
import TrelloContainer from './TrelloContainer';
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
    Container: props => <TrelloContainer {...props} cache={cache} />,
    displayName: createTrelloService.displayName,
    fetchTasks: fetchTasks.bind(null, config),
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
