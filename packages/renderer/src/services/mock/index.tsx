import { CustomTaskTimerEndOption, SelectItem, Service } from '@domain';
import MockCustomSelectGroup from './MockCustomSelectGroup';
import MockCustomSelectOption from './MockCustomSelectOption';
import MockInitializingView from './MockInitializingView';

export const mockServiceId = 'mock';

const createMockService = (): Service => {
  const getTaskHeading = (): string => 'Task';

  const getTaskTimerEndOptions = (): CustomTaskTimerEndOption[] => [
    { id: 'custom-one', label: 'Custom 1', action: 'switchTask' },
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
    fetchTasks,
    getTaskHeading,
    getTaskTimerEndOptions,
    InitializingView: MockInitializingView,
    onTaskTimerEndPromptHandled(taskId, action) {
      console.log(taskId, action);
    },
  };
};

export default createMockService;
