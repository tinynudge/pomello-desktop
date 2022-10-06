import { CacheProvider } from '@/shared/context/CacheContext';
import createCache from '@/shared/helpers/createCache';
import { ServiceFactory } from '@domain';
import { TrelloCache, TrelloConfig } from './domain';
import handleError from './errors/handleError';
import fetchTasks from './fetchTasks';
import getDefaultTrelloHeading from './getDefaultTrelloHeading';
import getTaskTimerEndItems from './getTaskTimerEndItems';
import onTaskTimerEndPromptHandled from './onTaskTimerEndPromptHandled';
import TrelloAuthView from './TrelloAuthView';
import trelloClient from './trelloClient';
import TrelloInitializingView from './TrelloInitializingView';

const createTrelloService: ServiceFactory<TrelloConfig> = ({ config, translate }) => {
  trelloClient.interceptors.request.use(requestConfig => {
    const { token } = config.get();

    if (token) {
      requestConfig.params.token = window.app.decryptValue(token);
    }

    return requestConfig;
  });

  const cache = createCache<TrelloCache>();

  return {
    AuthView: TrelloAuthView,
    Container: ({ children }) => <CacheProvider cache={cache} children={children} />,
    displayName: createTrelloService.displayName,
    fetchTasks: fetchTasks.bind(null, cache, config),
    getSelectTaskHeading: getDefaultTrelloHeading.bind(null, cache, translate),
    getTaskHeading: getDefaultTrelloHeading.bind(null, cache, translate),
    getTaskTimerEndItems: getTaskTimerEndItems.bind(null, cache, translate),
    handleError,
    id: createTrelloService.id,
    InitializingView: TrelloInitializingView,
    onTaskTimerEndPromptHandled: onTaskTimerEndPromptHandled.bind(null, config, cache),
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
