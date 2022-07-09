import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockService from '@/__fixtures__/createMockService';
import createMockSettings from '@/__fixtures__/createMockSettings';
import { Service, ServiceRegistry, Settings } from '@domain';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../Select';

export * from '@testing-library/react';

interface MountSelectOptions {
  appApi?: Partial<AppApi>;
  service?: Partial<Omit<Service, 'id'>>;
  settings?: Partial<Settings>;
}

const mountSelect = (options: MountSelectOptions = {}) => {
  const settings = createMockSettings(options.settings);
  const service = createMockService(options.service);

  const [appApi, emitAppApiEvent] = createMockAppApi(options.appApi, settings);
  window.app = appApi;

  const services: ServiceRegistry = {
    mock: () => service,
  };

  const result = render(<Select services={services} settings={settings} />);

  return {
    appApi,
    emitAppApiEvent,
    result,
    service,
    userEvent: userEvent.setup(),
  };
};

export default mountSelect;
