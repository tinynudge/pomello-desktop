import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { renderDashboard, screen } from '@/dashboard/__fixtures__/renderDashboard';
import { DashboardRoute } from '@pomello-desktop/domain';
import { createTrelloService } from '../createTrelloService';
import { TrelloConfigStore } from '../domain';
import translations from '../translations/en-US.json';
import { mockTrelloApi, TrelloApiResponses } from './mockTrelloApi';

type RenderTrelloConfigureViewOptions = {
  appApi?: Partial<AppApi>;
  config?: Partial<TrelloConfigStore>;
  trelloApi?: Partial<TrelloApiResponses>;
};

export const renderTrelloConfigureView = async (options: RenderTrelloConfigureViewOptions = {}) => {
  mockTrelloApi(options.trelloApi);

  const [config, configActions] = createMockServiceConfig(createTrelloService.id, {
    token: 'MY_TRELLO_TOKEN',
    currentList: 'TRELLO_LIST_ID',
    ...options.config,
  });

  const result = await renderDashboard({
    route: DashboardRoute.Services,
    services: [createTrelloService],
    appApi: {
      getTranslations: () => Promise.resolve(translations),
      ...options.appApi,
    },
    serviceConfigs: {
      trello: configActions,
    },
  });

  await result.userEvent.click(screen.getByRole('button', { name: 'Configure' }));

  return {
    ...result,
    config,
  };
};
