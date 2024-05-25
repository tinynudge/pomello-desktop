import { JSONSchemaType } from 'ajv';
import { StoreContents } from './StoreContents';

export type RegisterStoreOptions<TContents = StoreContents> = {
  defaults: Readonly<TContents>;
  emitChangeEvents?: boolean;
  path: string;
  schema: JSONSchemaType<TContents>;
};
