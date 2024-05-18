import { ServiceRuntime } from '@pomello-desktop/domain';
import { TrelloCache } from './TrelloCache';
import { TrelloConfig } from './TrelloConfig';
import { TrelloConfigStore } from './TrelloConfigStore';

export type TrelloRuntime = Omit<ServiceRuntime<TrelloConfigStore>, 'config'> & {
  cache: TrelloCache;
  config: TrelloConfig;
};
