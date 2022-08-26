import { ServiceFactory } from '@domain';
import ZenSelectTaskView from './ZenSelectTaskView';

const createZenService: ServiceFactory = () => {
  return {
    id: createZenService.id,
    displayName: createZenService.displayName,
    fetchTasks: () => Promise.resolve([]),
    SelectTaskView: props => <ZenSelectTaskView {...props} />,
  };
};

createZenService.displayName = 'Zen mode';
createZenService.id = 'zen';

export default createZenService;
