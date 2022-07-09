import { RegisterStoreOptions } from './RegisterStoreOptions';
import { Store } from './Store';
import { StoreContents } from './StoreContents';

export interface StoreManager {
  getOrFailStore<TContents = StoreContents>(id: string): Store<TContents>;
  registerStore<TContents = StoreContents>(
    options: RegisterStoreOptions<TContents>
  ): Store<TContents>;
}
