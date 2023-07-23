import type { JSONSchemaType } from 'ajv';
import type { StoreContents } from './StoreContents';

export interface ServiceConfigStore<TConfig = StoreContents> {
  defaults: Readonly<TConfig>;
  schema: JSONSchemaType<TConfig>;
}
