import { JSONSchemaType } from 'ajv';
import { StoreContents } from './StoreContents';

export interface RegisterStoreOptions<TContents = StoreContents> {
  defaults: Readonly<TContents>;
  directory?: string;
  emitChangeEvents?: boolean;
  name: string;
  schema: JSONSchemaType<TContents>;
}
