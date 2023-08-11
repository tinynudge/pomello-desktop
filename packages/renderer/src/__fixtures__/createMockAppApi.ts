import type { ServiceConfig, Settings } from '@domain';
import { vi } from 'vitest';
import mockHotkeys from './mockHotkeys';
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
    getActiveServiceId: vi.fn(() => Promise.resolve('mock')),
    getHotkeys: vi.fn(() => Promise.resolve(mockHotkeys)),
    getSettings: vi.fn(() => Promise.resolve(settings)),
    getThemeCss: vi.fn(() => Promise.resolve({ css: '', theme: 'light' })),
    getTranslations: vi.fn(() => Promise.resolve({})),
    hideSelect: vi.fn(),
    logMessage: vi.fn(),
    onSelectChange: vi.fn(callback => addListener('onSelectChange', callback)),
    onSelectHide: vi.fn(callback => addListener('onSelectHide', callback)),
    onSelectReset: vi.fn(callback => addListener('onSelectReset', callback)),
    onServicesChange: vi.fn(callback => addListener('onServicesChange', callback)),
    onSetSelectItems: vi.fn(callback => addListener('onSetSelectItems', callback)),
    onSettingsChange: vi.fn(callback => addListener('onSettingsChange', callback)),
    onSelectShow: vi.fn(callback => addListener('onShowSelect', callback)),
    onThemeCssChange: vi.fn(),
    registerServiceConfig: vi.fn((serviceId, { defaults }) =>
      Promise.resolve(serviceConfigs[serviceId] ?? mockRegisterServiceConfig(serviceId, defaults))
    ),
    resetSelect: vi.fn(),
    selectChange: vi.fn(),
    setActiveServiceId: vi.fn(),
    setSelectBounds: vi.fn(),
    setSelectItems: vi.fn(() => Promise.resolve()),
    showMessageBox: vi.fn(() => Promise.resolve({ checkboxChecked: false, response: 0 })),
    showSelect: vi.fn(() => Promise.resolve()),
    writeClipboardText: vi.fn(),
  };

  Object.entries(appApi).forEach(([key, value]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api[key] = vi.fn(value as any);
  });

  return [api, emit];
};

export default createMockAppApi;
