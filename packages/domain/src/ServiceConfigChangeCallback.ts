import { StoreContents } from './StoreContents';

export type ServiceConfigChangeCallback<TConfig = StoreContents> = (config: TConfig) => void;
