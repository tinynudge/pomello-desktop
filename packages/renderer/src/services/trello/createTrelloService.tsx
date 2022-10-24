import createCache from '@/shared/helpers/createCache';
import { ServiceFactory } from '@domain';
import { TrelloCache, TrelloConfig } from './domain';
import handleError from './errors/handleError';
import fetchTasks from './fetchTasks';
import getDefaultTrelloHeading from './getDefaultTrelloHeading';
import getTaskCompleteItems from './getTaskCompleteItems';
import getTaskTimerEndItems from './getTaskTimerEndItems';
import sanitizeTrelloError from './helpers/sanitizeTrelloError';
import onNoteCreate from './onNoteCreate';
import onPomelloEvent from './onPomelloEvent';
import onTaskCompletePromptHandled from './onTaskCompletePromptHandled';
import onTaskCreate from './onTaskCreate';
import onTaskSelect from './onTaskSelect';
import onTaskTimerEndPromptHandled from './onTaskTimerEndPromptHandled';
import TrelloAuthView from './TrelloAuthView';
import trelloClient from './trelloClient';
import TrelloContainer from './TrelloContainer';
import TrelloInitializingView from './TrelloInitializingView';
import { TrelloRuntime } from './TrelloRuntime';
import TrelloSelectOption from './TrelloSelectOption';

const createTrelloService: ServiceFactory<TrelloConfig> = runtime => {
  const trelloRuntime: TrelloRuntime = {
    ...runtime,
    cache: createCache<TrelloCache>(),
  };

  trelloClient.interceptors.request.use(requestConfig => {
    const { token } = trelloRuntime.cache.get();

    if (token) {
      requestConfig.params.token = token;
    }

    return requestConfig;
  });

  trelloClient.interceptors.response.use(undefined, error => {
    trelloRuntime.logger.error(JSON.stringify(sanitizeTrelloError(error)));

    throw error;
  });

  return {
    AuthView: TrelloAuthView,
    Container: ({ children }) => (
      <TrelloContainer cache={trelloRuntime.cache} children={children} />
    ),
    CustomSelectOption: TrelloSelectOption,
    displayName: createTrelloService.displayName,
    fetchTasks: fetchTasks.bind(null, trelloRuntime),
    getSelectTaskHeading: getDefaultTrelloHeading.bind(null, trelloRuntime),
    getTaskCompleteItems: getTaskCompleteItems.bind(null, trelloRuntime),
    getTaskHeading: getDefaultTrelloHeading.bind(null, trelloRuntime),
    getTaskTimerEndItems: getTaskTimerEndItems.bind(null, trelloRuntime),
    handleError,
    id: createTrelloService.id,
    InitializingView: TrelloInitializingView,
    onNoteCreate: onNoteCreate.bind(null, trelloRuntime),
    onPomelloEvent: onPomelloEvent.bind(null, trelloRuntime),
    onTaskCompletePromptHandled: onTaskCompletePromptHandled.bind(null, trelloRuntime),
    onTaskCreate: onTaskCreate.bind(null, trelloRuntime),
    onTaskSelect: onTaskSelect.bind(null, trelloRuntime),
    onTaskTimerEndPromptHandled: onTaskTimerEndPromptHandled.bind(null, trelloRuntime),
  };
};

createTrelloService.displayName = 'Trello';
createTrelloService.id = 'trello';

createTrelloService.config = {
  defaults: {},
  schema: {
    type: 'object',
    properties: {
      completedTaskPosition: { type: 'string', enum: ['bottom', 'top'], nullable: true },
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
