import type { ServiceFactory } from '@domain';

const createMockService: ServiceFactory = () => {
  return {
    id: createMockService.id,
    displayName: createMockService.displayName,
  };
};

createMockService.displayName = 'Mock service';
createMockService.id = 'mock';

export default createMockService;
