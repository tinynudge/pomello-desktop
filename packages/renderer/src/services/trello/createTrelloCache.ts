import createSignal from '@/shared/helpers/createSignal';
import { Signal } from '@domain';
import { TrelloCache } from './domain';

const createTrelloCache = (): Signal<TrelloCache> => createSignal<TrelloCache>({} as TrelloCache);

export default createTrelloCache;
