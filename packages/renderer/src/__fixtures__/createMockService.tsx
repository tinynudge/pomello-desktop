import {
  CreateFetchTaskNamesOptions,
  FetchTaskNames,
  Service,
  ServiceConfigStore,
  ServiceFactory,
} from '@pomello-desktop/domain';
import { vi } from 'vitest';

type MockService = {
  createFetchTaskNames?(options: CreateFetchTaskNamesOptions): FetchTaskNames;
  config?: ServiceConfigStore;
  service?: Partial<Service>;
};

export const createMockServiceFactory = ({
  config,
  createFetchTaskNames,
  service = {},
}: MockService = {}): ServiceFactory => {
  const createMockService: ServiceFactory = () => {
    const fetchTasks = async () => [
      { id: 'one', label: 'Task one' },
      { id: 'two', label: 'Task two' },
    ];

    return {
      displayName: createMockService.displayName,
      id: createMockService.id,
      onNoteCreate: vi.fn(),
      onTaskCreate: vi.fn(),
      ...service,
      fetchTasks: vi.fn(service.fetchTasks ?? fetchTasks),
    };
  };

  createMockService.displayName = service.displayName ?? 'Mock service';
  createMockService.hasConfigureView = !!service.ConfigureView;
  createMockService.id = service.id ?? 'mock';

  if (createFetchTaskNames) {
    createMockService.createFetchTaskNames =
      createFetchTaskNames as unknown as ServiceFactory['createFetchTaskNames'];
  }

  if (config) {
    createMockService.config = config as unknown as ServiceConfigStore<void>;
  }

  return createMockService;
};
