import type { ServiceConfig, Settings } from '@domain';
import { vi } from 'vitest';
import mockRegisterServiceConfig from './mockRegisterServiceConfig';

type CallbackFunction = (...args: unknown[]) => void;

type EventEmitter = (event: string, ...args: unknown[]) => void;

interface CreateMockAppApiOptions {
  appApi?: Partial<AppApi>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serviceConfigs?: Record<string, ServiceConfig<any>>;
  settings: Settings;
}

const createMockAppApi = ({
  appApi = {},
  serviceConfigs = {},
  settings,
}: CreateMockAppApiOptions): [AppApi, EventEmitter] => {
  const listenersMap = new Map<string, CallbackFunction[]>();

  const addListener = (event: string, callback: CallbackFunction) => {
    const listeners = listenersMap.get(event) ?? [];
    listenersMap.set(event, [...listeners, callback]);

    return () => {
      const listeners = listenersMap.get(event) ?? [];
      const updatedListeners = listeners.filter(listener => listener !== callback);

      listenersMap.set(event, updatedListeners);
    };
  };

  const emit = (event: string, ...args: unknown[]) => {
    const listeners = listenersMap.get(event) ?? [];

    for (const listener of listeners) {
      listener(...args);
    }
  };

  const api: AppApi = {
    getSettings: vi.fn(() => Promise.resolve(settings)),
    getThemeCss: vi.fn(() => Promise.resolve({ css: '', theme: 'light' })),
    getTranslations: vi.fn(() => Promise.resolve({})),
    logMessage: vi.fn(),
    onServicesChange: vi.fn(callback => addListener('onServicesChange', callback)),
    onSettingsChange: vi.fn(callback => addListener('onSettingsChange', callback)),
    onThemeCssChange: vi.fn(),
    registerServiceConfig: vi.fn((serviceId, { defaults }) =>
      Promise.resolve(serviceConfigs[serviceId] ?? mockRegisterServiceConfig(serviceId, defaults))
    ),
    showMessageBox: vi.fn(() => Promise.resolve({ checkboxChecked: false, response: 0 })),
  };

  Object.entries(appApi).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api[key] = vi.fn(value as any);
  });

  return [api, emit];
};

export default createMockAppApi;
