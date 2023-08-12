import type { SelectItem, ServiceFactory } from '@domain';

const createMockService: ServiceFactory = () => {
  const fetchTasks = () => {
    return new Promise<SelectItem[]>(resolve => {
      setTimeout(() => {
        resolve([
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
          { id: 'three', label: 'Three' },
        ]);
      }, 1_000);
    });
  };

  return {
    displayName: createMockService.displayName,
    fetchTasks,
    id: createMockService.id,
  };
};

createMockService.displayName = 'Mock service';
createMockService.id = 'mock';

export default createMockService;
