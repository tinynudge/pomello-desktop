import { InitializingView, Service, ServiceFactory } from '@domain';
import { useEffect } from 'react';
import { vi } from 'vitest';

const MockInitializingView: InitializingView = ({ onReady }) => {
  useEffect(onReady, [onReady]);

  return <div>Initializing</div>;
};

const createMockServiceFactory = (service: Partial<Omit<Service, 'id'>> = {}): ServiceFactory => {
  const createMockService: ServiceFactory = () => {
    const fetchTasks = async () => [
      { id: 'one', label: 'Task one' },
      { id: 'two', label: 'Task two' },
    ];

    return {
      displayName: createMockService.displayName,
      id: 'mock',
      InitializingView: MockInitializingView,
      handleNoteAdd: vi.fn(),
      ...service,
      fetchTasks: vi.fn(service.fetchTasks ?? fetchTasks),
    };
  };

  createMockService.displayName = 'Mock service';

  return createMockService;
};

export default createMockServiceFactory;
