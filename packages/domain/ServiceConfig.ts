import { ServiceConfigChangeCallback } from './ServiceConfigChangeCallback';
import { StoreContents } from './StoreContents';

export interface ServiceConfig<TConfig = StoreContents> {
  get(): TConfig;
  onChange(callback: ServiceConfigChangeCallback<TConfig>): void;
  set<TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]): void;
  unregister(): void;
}
