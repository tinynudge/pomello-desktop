import { JSONSchemaType } from 'ajv';
import { StoreContents } from './StoreContents';

export interface ServiceConfig<TConfig = StoreContents> {
  defaults: Readonly<TConfig>;
  schema: JSONSchemaType<TConfig>;
}
