import { CacheProvider } from '@/shared/context/CacheContext';
import bindContext from '@/shared/helpers/bindContext';
import createCache from '@/shared/helpers/createCache';
import { ServiceFactory } from '@domain';
import api from './api';
import { TrelloCache, TrelloConfig } from './domain';
import handleError from './errors/handleError';
import fetchTasks from './fetchTasks';
import getDefaultTrelloHeading from './getDefaultTrelloHeading';
import getTaskCompleteItems from './getTaskCompleteItems';
import getTaskTimerEndItems from './getTaskTimerEndItems';
import onTaskCompletePromptHandled from './onTaskCompletePromptHandled';
import onTaskCreate from './onTaskCreate';
import onTaskTimerEndPromptHandled from './onTaskTimerEndPromptHandled';
import TrelloAuthView from './TrelloAuthView';
import trelloClient from './trelloClient';
import TrelloInitializingView from './TrelloInitializingView';
import { TrelloRuntime } from './TrelloRuntime';

const createTrelloService: ServiceFactory<TrelloConfig> = runtime => {
  const trelloRuntime: TrelloRuntime = {
    ...runtime,
    api: bindContext(api, runtime.logger),
    cache: createCache<TrelloCache>(),
  };

  trelloClient.interceptors.request.use(requestConfig => {
    const { token } = runtime.config.get();

    if (token) {
      requestConfig.params.token = window.app.decryptValue(token);
    }

    return requestConfig;
  });

  return {
    AuthView: TrelloAuthView,
    Container: ({ children }) => <CacheProvider cache={trelloRuntime.cache} children={children} />,
    displayName: createTrelloService.displayName,
    fetchTasks: fetchTasks.bind(null, trelloRuntime),
    getSelectTaskHeading: getDefaultTrelloHeading.bind(null, trelloRuntime),
    getTaskCompleteItems: getTaskCompleteItems.bind(null, trelloRuntime),
    getTaskHeading: getDefaultTrelloHeading.bind(null, trelloRuntime),
    getTaskTimerEndItems: getTaskTimerEndItems.bind(null, trelloRuntime),
    handleError,
    id: createTrelloService.id,
    InitializingView: TrelloInitializingView,
    onTaskCompletePromptHandled: onTaskCompletePromptHandled.bind(null, trelloRuntime),
    onTaskTimerEndPromptHandled: onTaskTimerEndPromptHandled.bind(null, trelloRuntime),
    onTaskCreate: onTaskCreate.bind(null, trelloRuntime),
  };
};

createTrelloService.displayName = 'Trello';
createTrelloService.id = 'trello';

createTrelloService.config = {
  defaults: {},
  schema: {
    type: 'object',
    properties: {
      createdTaskPosition: { type: 'string', enum: ['bottom', 'top'], nullable: true },
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
