import { ServiceConfigChangeCallback } from './ServiceConfigChangeCallback';
import { StoreContents } from './StoreContents';

export type ServiceConfig<TConfig = StoreContents> = {
  get(): TConfig;
  onChange(callback: ServiceConfigChangeCallback<TConfig>): () => void;
  set<TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]): void;
  unregister(): void;
  unset(key: keyof TConfig): void;
};
