import { ServiceFactory } from '@pomello-desktop/domain';
import { ZenSelectTaskView } from './ZenSelectTaskView';

export const createZenService: ServiceFactory = () => {
  return {
    displayName: createZenService.displayName,
    fetchTasks: () => Promise.resolve([]),
    id: createZenService.id,
    SelectTaskView: ZenSelectTaskView,
  };
};

createZenService.displayName = 'Zen mode';
createZenService.hasConfigureView = false;
createZenService.id = 'zen';
