import { BoundObject } from '@/shared/helpers/bindContext';
import { Cache, Logger, ServiceRuntime } from '@domain';
import api from './api';
import { TrelloCache, TrelloConfig } from './domain';

export interface TrelloRuntime extends ServiceRuntime<TrelloConfig> {
  api: BoundObject<Logger, typeof api>;
  cache: Cache<TrelloCache>;
}
