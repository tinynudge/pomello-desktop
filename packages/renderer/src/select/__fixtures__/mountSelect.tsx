import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockServiceFactory from '@/__fixtures__/createMockService';
import createMockSettings from '@/__fixtures__/createMockSettings';
import { Service, ServiceRegistry, SetSelectItemsOptions, Settings } from '@domain';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import translations from '../../../../translations/en-US.json';
import Select from '../Select';

export * from '@testing-library/react';

interface MountSelectOptions {
  appApi?: Partial<AppApi>;
  service?: Partial<Omit<Service, 'id'>>;
  setSelectItems?: SetSelectItemsOptions;
  settings?: Partial<Settings>;
}

const mountSelect = (options: MountSelectOptions = {}) => {
  const settings = createMockSettings(options.settings);
  const mockServiceFactory = createMockServiceFactory('mock', options.service);

  const [appApi, emitAppApiEvent] = createMockAppApi(options.appApi, settings);
  window.app = appApi;

  const services: ServiceRegistry = {
    [mockServiceFactory.id]: mockServiceFactory,
  };

  const result = render(
    <TranslationsProvider translations={translations}>
      <Select services={services} settings={settings} />
    </TranslationsProvider>
  );

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

export default mountSelect;
