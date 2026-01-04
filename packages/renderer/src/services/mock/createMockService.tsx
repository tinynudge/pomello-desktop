import {
  SelectItem,
  ServiceFactory,
  TaskCompleteItems,
  TaskTimerEndItems,
} from '@pomello-desktop/domain';
import { MockCustomSelectGroup } from './MockCustomSelectGroup';
import { MockCustomSelectOption } from './MockCustomSelectOption';
import { MockInitializingView } from './MockInitializingView';

export const createMockService: ServiceFactory = () => {
  const getTaskHeading = (): string => 'Task';

  const getTaskCompleteItems = (): TaskCompleteItems => ({
    items: [{ id: 'do-something', label: 'Do something' }],
  });

  const getTaskTimerEndItems = (): TaskTimerEndItems => ({
    items: [{ id: 'custom-one', label: 'Custom 1' }],
  });

  const fetchTasks = () => {
    return new Promise<SelectItem[]>(resolve => {
      setTimeout(() => {
        resolve([
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
          { id: 'three', label: 'Three' },
        ]);
      }, 800);
    });
  };

  return {
    id: createMockService.id,
    CustomSelectGroup: MockCustomSelectGroup,
    CustomSelectOption: MockCustomSelectOption,
    displayName: createMockService.displayName,
    fetchTasks,
    getTaskCompleteItems,
    getTaskHeading,
    getTaskTimerEndItems,
    InitializingView: MockInitializingView,
    onNoteCreate: (_taskId, { type, text }) => {
      new Notification(type, { body: text });
    },
    onTaskCreate: text => {
      new Notification(text);
    },
    onTaskCompletePromptHandled({ optionId, taskId }) {
      new Notification(taskId, { body: optionId });
    },
    onTaskTimerEndPromptHandled({ optionId, taskId }) {
      console.log(taskId, optionId);
    },
  };
};

createMockService.displayName = 'Mock service';
createMockService.hasConfigureView = false;
createMockService.id = 'mock';
