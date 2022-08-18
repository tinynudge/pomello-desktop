import { SelectItem, SelectOptionType, Service } from '@domain';
import MockCustomSelectGroup from './MockCustomSelectGroup';
import MockCustomSelectOption from './MockCustomSelectOption';
import MockInitializingView from './MockInitializingView';

export const mockServiceId = 'mock';

const createMockService = (): Service => {
  const getTaskHeading = (): string => 'Task';

  const getCompleteTaskOptions = (): SelectOptionType[] => [
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
    id: mockServiceId,
    CustomSelectGroup: MockCustomSelectGroup,
    CustomSelectOption: MockCustomSelectOption,
    displayName: 'Mock service',
    fetchTasks,
    getCompleteTaskOptions,
    getTaskHeading,
    getTaskTimerEndOptions,
    handleNoteAdd: (type, note) => {
      new Notification(type, { body: note });
    },
    InitializingView: MockInitializingView,
    onTaskCompletePromptHandled(taskId, action) {
      new Notification(taskId, { body: action });
    },
    onTaskTimerEndPromptHandled(taskId, action) {
      console.log(taskId, action);
    },
  };
};

export default createMockService;
