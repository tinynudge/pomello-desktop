import { createMockAppApi } from '@/__fixtures__/createMockAppApi';
import { createMockLogger } from '@/__fixtures__/createMockLogger';
import { createMockServiceFactory } from '@/__fixtures__/createMockService';
import { createMockServiceConfig } from '@/__fixtures__/createMockServiceConfig';
import { createMockSettings } from '@/__fixtures__/createMockSettings';
import { RuntimeProvider } from '@/shared/context/RuntimeContext';
import {
  PomelloServiceConfig,
  Service,
  ServiceRegistry,
  SetSelectItemsOptions,
  Settings,
} from '@pomello-desktop/domain';
import { render } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import translations from '../../../../../translations/en-US.json';
import { Select } from '../Select';
import { ServiceProvider } from '@/shared/context/ServiceContext';

export * from '@solidjs/testing-library';

type RenderSelectOptions = {
  appApi?: Partial<AppApi>;
  service?: Partial<Service>;
  serviceId?: string;
  setSelectItems?: SetSelectItemsOptions;
  settings?: Partial<Settings>;
};

export const renderSelect = (options: RenderSelectOptions = {}) => {
  const logger = createMockLogger();
  const settings = createMockSettings(options.settings);
  const mockServiceFactory = createMockServiceFactory({ service: options.service });
  const [pomelloConfig] = createMockServiceConfig<PomelloServiceConfig>('pomello', {});

  const [appApi, emitAppApiEvent] = createMockAppApi({
    appApi: options.appApi,
    settings,
  });

  const services: ServiceRegistry = {
    [mockServiceFactory.id]: mockServiceFactory,
  };

  const result = render(() => (
    <RuntimeProvider
      initialLogger={logger}
      initialPomelloConfig={pomelloConfig}
      initialServices={services}
      initialSettings={settings}
      initialTranslations={translations}
    >
      <ServiceProvider initialServiceId={options.serviceId}>
        <Select />
      </ServiceProvider>
    </RuntimeProvider>
  ));

  if (options.setSelectItems) {
    emitAppApiEvent('onSetSelectItems', options.setSelectItems);
  }

  return {
    appApi,
    emitAppApiEvent,
    result,
    userEvent: userEvent.setup(),
  };
};
