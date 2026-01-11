import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { renderApp, RenderAppOptions } from '@/app/__fixtures__/renderApp';
import { createTrelloService } from '..';
import { TrelloCache, TrelloConfigStore } from '../domain';
import translations from '../translations/en-US.json';
import { mockTrelloApi, TrelloApiResponses } from './mockTrelloApi';

export * from '@solidjs/testing-library';

type RenderTrelloServiceOptions = Pick<RenderAppOptions, 'appApi' | 'pomelloApi' | 'settings'> & {
  config?: Partial<TrelloConfigStore>;
  trelloApi?: Partial<TrelloApiResponses>;
};

const originalCreateTrelloCache = vi.hoisted(async () => {
  const { createTrelloCache } = await import('@/services/trello/createTrelloCache');

  return createTrelloCache;
});

let cache: TrelloCache;

vi.mock('@/services/trello/createTrelloCache.ts', () => ({
  createTrelloCache: () => cache,
}));

export const renderTrelloService = async ({
  appApi,
  config: initialConfig,
  trelloApi,
  ...remainingOptions
}: RenderTrelloServiceOptions = {}) => {
  cache = (await originalCreateTrelloCache)();

  mockTrelloApi(trelloApi);

  const [config, configActions] = createMockServiceConfig(createTrelloService.id, {
    token: 'MY_TRELLO_TOKEN',
    currentList: 'TRELLO_LIST_ID',
    ...initialConfig,
  });

  const results = renderApp({
    appApi: {
      getTranslations: () => Promise.resolve(translations),
      ...appApi,
    },
    createServiceRegistry: () => ({
      [createTrelloService.id]: createTrelloService,
    }),
    serviceConfigs: {
      trello: configActions,
    },
    serviceId: createTrelloService.id,
    ...remainingOptions,
  });

  return {
    ...results,
    cache,
    config,
  };
};
