import mountApp from '@/app/__fixtures__/mountApp';
import createMockServiceConfig from '@/__fixtures__/createMockServiceConfig';
import createTrelloService from '..';
import { TrelloConfig } from '../TrelloConfig';

export * from '@testing-library/react';

interface MountTrelloServiceOptions {
  config?: Partial<TrelloConfig>;
}

const mountTrelloService = ({ config }: MountTrelloServiceOptions = {}) => {
  const defaultConfig: TrelloConfig = {
    token: 'MY_TRELLO_TOKEN',
  };

  const registerServiceConfig = () =>
    createMockServiceConfig<TrelloConfig>(createTrelloService.id, createTrelloService.config!, {
      ...defaultConfig,
      ...config,
    }) as any;

  return mountApp({
    appApi: { registerServiceConfig },
    createServiceRegistry: () => ({
      [createTrelloService.id]: createTrelloService,
    }),
    serviceId: createTrelloService.id,
  });
};

export default mountTrelloService;
