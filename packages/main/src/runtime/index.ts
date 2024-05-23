import { Runtime } from '@pomello-desktop/domain';
import { createStoreManager } from './createStoreManager';
import { createWindowManager } from './createWindowManager';

export const runtime: Runtime = {
  storeManager: createStoreManager(),
  windowManager: createWindowManager(),
};
