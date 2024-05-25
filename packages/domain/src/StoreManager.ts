import { RegisterStoreOptions } from './RegisterStoreOptions';
import { Store } from './Store';
import { StoreContents } from './StoreContents';

export type StoreManager = {
  getOrFailStore<TContents extends StoreContents = StoreContents>(id: string): Store<TContents>;
  registerStore<TContents extends StoreContents = StoreContents>(
    options: RegisterStoreOptions<TContents>
  ): Store<TContents>;
};
