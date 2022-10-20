import { Cache, ServiceRuntime } from '@domain';
import { TrelloCache, TrelloConfig } from './domain';

export interface TrelloRuntime extends ServiceRuntime<TrelloConfig> {
  cache: Cache<TrelloCache>;
}
