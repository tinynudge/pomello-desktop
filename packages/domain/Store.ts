import type { StoreContents } from './StoreContents';

export interface Store<TContents = StoreContents> {
  all(): TContents;
  delete<TKey extends keyof TContents>(key: TKey): void;
  get<TKey extends keyof TContents>(key: TKey): TContents[TKey];
  set<TKey extends keyof TContents>(key: TKey, value: TContents[TKey]): void;
  unset(key: keyof TContents): void;
}
