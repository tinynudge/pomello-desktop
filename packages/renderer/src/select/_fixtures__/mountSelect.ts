import createMockAppApi from '@/__fixtures__/createMockAppApi';
import createMockLogger from '@/__fixtures__/createMockLogger';
import createMockServiceFactory from '@/__fixtures__/createMockService';
import createMockSettings from '@/__fixtures__/createMockSettings';
import type { Service, ServiceRegistry, SetSelectItemsOptions, Settings } from '@domain';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import { vi } from 'vitest';
import translations from '../../../../translations/en-US.json';
import Select from '../Select.svelte';

export * from '@testing-library/svelte';

interface MountSelectOptions {
  appApi?: Partial<AppApi>;
  service?: Partial<Service>;
  serviceId?: string;
  setSelectItems?: SetSelectItemsOptions;
  settings?: Partial<Settings>;
}

const mountSelect = (options: MountSelectOptions = {}) => {
  // Since tests are running in a Node environment, it uses the "node" exports
  // from Svelte which point to the SSR import path. For SSR, life cycle methods
  // do not run and are exported as a noop.
  // https://github.com/testing-library/svelte-testing-library/issues/222#issuecomment-1588987135
  vi.mock('svelte', async () => {
    const actual = (await vi.importActual('svelte')) as object;
    return {
      ...actual,
      afterUpdate: (await import('svelte/internal')).afterUpdate,
      onMount: (await import('svelte/internal')).onMount,
    };
  });

  const settings = createMockSettings(options.settings);
  const mockServiceFactory = createMockServiceFactory({ service: options.service });

  const [appApi, emitAppApiEvent] = createMockAppApi({
    appApi: options.appApi,
    settings,
  });
  window.app = appApi;

  const services: ServiceRegistry = {
    [mockServiceFactory.id]: mockServiceFactory,
  };

  const result = render(Select, {
    initialServiceId: options.serviceId,
    logger: createMockLogger(),
    services,
    settings,
    translations,
  });

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

mountSelect.andInitialize = async (options: MountSelectOptions = {}) => {
  const result = mountSelect(options);

  await tick();

  return result;
};

export default mountSelect;
