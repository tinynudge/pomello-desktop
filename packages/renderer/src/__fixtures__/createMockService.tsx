import { InitializingView, Service, ServiceConfig, ServiceFactory } from '@domain';
import { useEffect } from 'react';
import { vi } from 'vitest';

const MockInitializingView: InitializingView = ({ onReady }) => {
  useEffect(onReady, [onReady]);

  return <div>Initializing</div>;
};

const createMockServiceFactory = (
  serviceId = 'mock',
  service: Partial<Omit<Service, 'id'>> = {},
  config?: ServiceConfig
): ServiceFactory => {
  const createMockService: ServiceFactory = () => {
    const fetchTasks = async () => [
      { id: 'one', label: 'Task one' },
      { id: 'two', label: 'Task two' },
    ];

    return {
      displayName: createMockService.displayName,
      id: createMockService.id,
      InitializingView: MockInitializingView,
      handleNoteAdd: vi.fn(),
      ...service,
      fetchTasks: vi.fn(service.fetchTasks ?? fetchTasks),
    };
  };

  createMockService.displayName = 'Mock service';
  createMockService.id = serviceId;

  if (config) {
    createMockService.config = config as unknown as ServiceConfig<void>;
  }

  return createMockService;
};

export default createMockServiceFactory;
