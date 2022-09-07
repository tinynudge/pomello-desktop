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
import translations from '../translations/en-US.json';
import generateTrelloMember from './generateTrelloMember';

export * from '@testing-library/react';

interface TrelloApiResponses {
  'members/me': TrelloMember | ResponseResolver<RestRequest, RestContext, TrelloMember>;
}

interface MountTrelloServiceOptions {
  config?: Partial<TrelloConfig>;
  trelloApi?: Partial<TrelloApiResponses>;
}

let cache: Cache<TrelloCache>;

vi.mock('@/shared/helpers/createCache', () => ({
  default: () => cache,
}));

const mountTrelloService = async ({
  config: initialConfig,
  trelloApi,
}: MountTrelloServiceOptions = {}) => {
  cache = createMockCache<TrelloCache>();

  mockServer.use(
    rest.get(
      `${TRELLO_API_URL}members/me`,
      createRestResolver<TrelloMember>(generateTrelloMember(), trelloApi?.['members/me'])
    )
  );

  const defaultConfig: TrelloConfig = {
    token: 'MY_TRELLO_TOKEN',
    currentList: 'TRELLO_LIST_ID',
  };

  const config = await createMockServiceConfig<TrelloConfig>(
    createTrelloService.id,
    createTrelloService.config!,
    { ...defaultConfig, ...initialConfig }
  );

  const registerServiceConfig = () => Promise.resolve(config) as any;

  const results = mountApp({
    appApi: {
      registerServiceConfig,
      getTranslations: () => Promise.resolve(translations),
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
