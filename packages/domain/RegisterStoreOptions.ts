import { StoreContents } from '@domain';
import { JSONSchemaType } from 'ajv';

export interface RegisterStoreOptions<TContents = StoreContents> {
  defaults: Readonly<TContents>;
  emitChangeEvents?: boolean;
  path: string;
  schema: JSONSchemaType<TContents>;
}
