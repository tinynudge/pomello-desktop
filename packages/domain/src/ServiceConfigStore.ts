import { JSONSchemaType } from 'ajv';
import { StoreContents } from './StoreContents';

export interface ServiceConfigStore<TConfig = StoreContents> {
  defaults: Readonly<TConfig>;
  schema: JSONSchemaType<TConfig>;
}
