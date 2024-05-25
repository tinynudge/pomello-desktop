import { JSONSchemaType } from 'ajv';
import { StoreContents } from './StoreContents';

export type ServiceConfigStore<TConfig = StoreContents> = {
  defaults: Readonly<TConfig>;
  schema: JSONSchemaType<TConfig>;
};
