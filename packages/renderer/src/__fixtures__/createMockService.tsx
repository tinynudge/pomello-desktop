import { InitializingView, Service } from '@domain';
import { useEffect } from 'react';
import { vi } from 'vitest';

const MockInitializingView: InitializingView = ({ onReady }) => {
  useEffect(onReady, [onReady]);

  return <div>Initializing</div>;
};

const createMockService = (service: Partial<Omit<Service, 'id'>> = {}): Service => {
  const fetchTasks = async () => [
    { id: 'one', label: 'Task one' },
    { id: 'two', label: 'Task two' },
  ];

  return {
    id: 'mock',
    InitializingView: MockInitializingView,
    ...service,
    fetchTasks: vi.fn(service.fetchTasks ?? fetchTasks),
  };
};

export default createMockService;
