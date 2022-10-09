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
    handleNoteAdd: (type, note) => {
      new Notification(type, { body: note });
    },
    InitializingView: MockInitializingView,
    onTaskCreate: text => {
      new Notification(text);
    },
    onTaskCompletePromptHandled(taskId, action) {
      new Notification(taskId, { body: action });
    },
    onTaskTimerEndPromptHandled(taskId, action) {
      console.log(taskId, action);
    },
  };
};

createMockService.displayName = 'Mock service';
createMockService.id = 'mock';

export default createMockService;
