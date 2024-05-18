import { Runtime } from '@pomello-desktop/domain';
import createStoreManager from './createStoreManager';
import createWindowManager from './createWindowManager';

const runtime: Runtime = {
  storeManager: createStoreManager(),
  windowManager: createWindowManager(),
};

export default runtime;
