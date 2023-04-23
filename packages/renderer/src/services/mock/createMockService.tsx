import { SelectItem, SelectOptionType, ServiceFactory } from '@domain';
import MockCustomSelectGroup from './MockCustomSelectGroup';
import MockCustomSelectOption from './MockCustomSelectOption';
import MockInitializingView from './MockInitializingView';

const createMockService: ServiceFactory = () => {
  const getTaskHeading = (): string => 'Task';

  const getTaskCompleteItems = (): SelectOptionType[] => [
    { id: 'do-something', label: 'Do something' },
  ];

  const getTaskTimerEndOptions = (): SelectOptionType[] => [
    { id: 'custom-one', label: 'Custom 1' },
  ];

  const fetchTasks = () => {
    return new Promise<SelectItem[]>(resolve => {
      setTimeout(() => {
        resolve([
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
          { id: 'three', label: 'Three' },
        ]);
      }, 1000);
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
    getTaskTimerEndOptions,
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
createMockService.id = 'mock';

export default createMockService;
