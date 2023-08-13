import type { StoreSubscription, UnsubscribeHandler } from '@domain';
import type { StoreContents } from './StoreContents';

export interface ServiceConfig<TConfig = StoreContents> {
  get(): TConfig;
  set<TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]): void;
  subscribe(subscription: StoreSubscription<TConfig>): UnsubscribeHandler;
  unregister(): void;
  unset(key: keyof TConfig): void;
}
