import { StoreContents } from './StoreContents';

export interface Store<TContents = StoreContents> {
  all(): TContents;
  get(key: keyof TContents): TContents[keyof TContents];
  set(key: keyof TContents, value: TContents[keyof TContents]): void;
  unset(key: keyof TContents): void;
}
