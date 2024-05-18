import { ServiceConfigChangeCallback } from './ServiceConfigChangeCallback';
import { StoreContents } from './StoreContents';

export interface ServiceConfigActions<TConfig = StoreContents> {
  contents: TConfig;
  onChange(callback: ServiceConfigChangeCallback<TConfig>): () => void;
  set<TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]): void;
  unset(key: keyof TConfig): void;
}
