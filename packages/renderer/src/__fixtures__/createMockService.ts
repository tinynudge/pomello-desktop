import type { Service, ServiceConfigStore, ServiceFactory } from '@domain';

interface MockService {
  config?: ServiceConfigStore;
  service?: Partial<Service>;
}

const createMockServiceFactory = ({ config, service = {} }: MockService = {}): ServiceFactory => {
  const createMockService: ServiceFactory = () => {
    const fetchTasks = async () => [
      { id: 'one', label: 'Task one' },
      { id: 'two', label: 'Task two' },
    ];

    return {
      displayName: createMockService.displayName,
      fetchTasks,
      id: createMockService.id,
      ...service,
    };
  };

  createMockService.displayName = service.displayName ?? 'Mock service';
  createMockService.id = service.id ?? 'mock';

  if (config) {
    createMockService.config = config as unknown as ServiceConfigStore<void>;
  }

  return createMockService;
};

export default createMockServiceFactory;
