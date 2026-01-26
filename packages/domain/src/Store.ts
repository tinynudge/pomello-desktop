import { StoreContents } from './StoreContents';
import { Unsubscribe } from './Unsubscribe';

export type Store<TContents = StoreContents> = {
  all(): TContents;
  delete<TKey extends keyof TContents>(key: TKey): void;
  get<TKey extends keyof TContents>(key: TKey): TContents[TKey];
  onChange<TKey extends keyof TContents>(
    key: TKey,
    callback: (
      value: TContents[TKey] | undefined,
      previousValue: TContents[TKey] | undefined
    ) => void
  ): Unsubscribe;
  set(store: Partial<TContents>): void;
  set<TKey extends keyof TContents>(key: TKey, value: TContents[TKey]): void;
  unset(key: keyof TContents): void;
};
