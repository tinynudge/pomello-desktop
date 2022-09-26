import mountApp from '@/app/__fixtures__/mountApp';
import createMockCache from '@/__fixtures__/createMockCache';
import createMockServiceConfig from '@/__fixtures__/createMockServiceConfig';
import createRestResolver from '@/__fixtures__/createRestResolver';
import mockServer from '@/__fixtures__/mockServer';
import { Cache } from '@domain';
import { ResponseResolver, rest, RestContext, RestRequest } from 'msw';
import { vi } from 'vitest';
import createTrelloService from '..';
import { TRELLO_API_URL } from '../constants';
import { TrelloCache, TrelloConfig, TrelloMember } from '../domain';
import { TrelloCard } from '../domain/TrelloCard';
import translations from '../translations/en-US.json';
import generateTrelloCard from './generateTrelloCard';
import generateTrelloMember from './generateTrelloMember';

export * from '@testing-library/react';

interface TrelloApiResponses {
  fetchBoardsAndLists: TrelloMember | ResponseResolver<RestRequest, RestContext, TrelloMember>;
  fetchCardsByListId: TrelloCard[] | ResponseResolver<RestRequest, RestContext, TrelloCard[]>;
}

interface MountTrelloServiceOptions {
  appApi?: Partial<AppApi>;
  config?: Partial<TrelloConfig>;
  trelloApi?: Partial<TrelloApiResponses>;
}

let cache: Cache<TrelloCache>;

vi.mock('@/shared/helpers/createCache', () => ({
  default: () => cache,
}));

const mountTrelloService = async ({
  appApi,
  config: initialConfig,
  trelloApi,
}: MountTrelloServiceOptions = {}) => {
  cache = createMockCache<TrelloCache>();

  mockServer.use(
    rest.get(
      `${TRELLO_API_URL}members/me`,
      createRestResolver<TrelloMember>(generateTrelloMember(), trelloApi?.fetchBoardsAndLists)
    ),
    rest.get(
      `${TRELLO_API_URL}lists/:listId/cards`,
      createRestResolver<TrelloCard[]>([generateTrelloCard()], trelloApi?.fetchCardsByListId)
    )
  );

  const defaultConfig: TrelloConfig = {
    token: 'MY_TRELLO_TOKEN',
    currentList: 'TRELLO_LIST_ID',
  };

  const config = createMockServiceConfig<TrelloConfig>(createTrelloService.id, {
    ...defaultConfig,
    ...initialConfig,
  });

  const registerServiceConfig = () => Promise.resolve(config) as any;

  const results = mountApp({
    appApi: {
      registerServiceConfig,
      getTranslations: () => Promise.resolve(translations),
      ...appApi,
    },
    createServiceRegistry: () => ({
      [createTrelloService.id]: createTrelloService,
    }),
    serviceId: createTrelloService.id,
  });

  return {
    ...results,
    cache,
    config,
  };
};

export default mountTrelloService;
