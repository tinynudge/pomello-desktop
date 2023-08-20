import { ServiceRuntime, Signal } from '@domain';
import { TrelloCache, TrelloConfig } from './domain';

export interface TrelloRuntime extends ServiceRuntime<TrelloConfig> {
  cache: Signal<TrelloCache>;
}
