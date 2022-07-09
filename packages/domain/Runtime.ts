import { StoreManager } from './StoreManager';
import { WindowManager } from './WindowManager';

export interface Runtime {
  storeManager: StoreManager;
  windowManager: WindowManager;
}
