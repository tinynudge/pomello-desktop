import { ServiceFactory } from '@pomello-desktop/domain';
import { TrelloAuthView } from './TrelloAuthView';
import { TrelloInitializingView } from './TrelloInitializingView';
import { TrelloRuntimeProvider } from './TrelloRuntimeContext';
import { TrelloSelectOption } from './TrelloSelectOption';
import { createPomelloEventListeners } from './createPomelloEventListeners';
import { createTrelloCache } from './createTrelloCache';
import { createTrelloConfig } from './createTrelloConfig';
import { TrelloConfigStore, TrelloRuntime } from './domain';
import { handleError } from './errors/handleError';
import { fetchTasks } from './fetchTasks';
import { getDefaultTrelloHeading } from './getDefaultTrelloHeading';
import { getTaskCompleteItems } from './getTaskCompleteItems';
import { getTaskTimerEndItems } from './getTaskTimerEndItems';
import { getTrackingEventServiceData } from './getTrackingEventServiceData';
import { onNoteCreate } from './onNoteCreate';
import { onTaskCompletePromptHandled } from './onTaskCompletePromptHandled';
import { onTaskCreate } from './onTaskCreate';
import { onTaskOpen } from './onTaskOpen';
import { onTaskSelect } from './onTaskSelect';
import { onTaskTimerEndPromptHandled } from './onTaskTimerEndPromptHandled';
import { onTrelloServiceMount } from './onTrelloServiceMount';

export const createTrelloService: ServiceFactory<TrelloConfigStore> = runtime => {
  const trelloRuntime: TrelloRuntime = {
    ...runtime,
    cache: createTrelloCache(),
    config: createTrelloConfig(runtime),
  };

  return {
    AuthView: () => <TrelloAuthView setToken={trelloRuntime.config.actions.tokenSet} />,
    Container: props => (
      <TrelloRuntimeProvider defaultRuntime={trelloRuntime} children={props.children} />
    ),
    CustomSelectOption: TrelloSelectOption,
    displayName: createTrelloService.displayName,
    fetchTasks: fetchTasks.bind(null, trelloRuntime),
    getSelectTaskHeading: getDefaultTrelloHeading.bind(null, trelloRuntime),
    getTaskCompleteItems: getTaskCompleteItems.bind(null, trelloRuntime),
    getTaskHeading: getDefaultTrelloHeading.bind(null, trelloRuntime),
    getTaskTimerEndItems: getTaskTimerEndItems.bind(null, trelloRuntime),
    getTrackingEventServiceData: getTrackingEventServiceData.bind(null, trelloRuntime),
    handleError,
    id: createTrelloService.id,
    InitializingView: TrelloInitializingView,
    onMount: onTrelloServiceMount.bind(null, trelloRuntime),
    onNoteCreate: onNoteCreate.bind(null, trelloRuntime),
    onTaskCompletePromptHandled: onTaskCompletePromptHandled.bind(null, trelloRuntime),
    onTaskCreate: onTaskCreate.bind(null, trelloRuntime),
    onTaskOpen: onTaskOpen.bind(null, trelloRuntime),
    onTaskSelect: onTaskSelect.bind(null, trelloRuntime),
    onTaskTimerEndPromptHandled: onTaskTimerEndPromptHandled.bind(null, trelloRuntime),
    pomelloEventListeners: createPomelloEventListeners(trelloRuntime),
  };
};

createTrelloService.displayName = 'Trello';
createTrelloService.hasConfigureView = true;
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
