import { ServiceConfigActions, Settings } from '@pomello-desktop/domain';
import { vi } from 'vitest';
import { mockHotkeys } from './mockHotkeys';
import { mockRegisterServiceConfig } from './mockRegisterServiceConfig';

export type MockAppEventEmitter = (event: string, ...args: unknown[]) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallbackFunction = (...args: any[]) => any;

type CreateMockAppApiOptions = {
  appApi?: Partial<AppApi>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serviceConfigs?: Record<string, ServiceConfigActions<any>>;
  settings: Settings;
};

export const createMockAppApi = ({
  appApi = {},
  serviceConfigs = {},
  settings,
}: CreateMockAppApiOptions): [AppApi, MockAppEventEmitter] => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emit = (event: string, ...args: any[]) => {
    const listeners = listenersMap.get(event) ?? [];

    for (const listener of listeners) {
      listener(...args);
    }
  };

  const api: AppApi = {
    decryptValue: vi.fn(appApi.decryptValue ?? (value => value)),
    encryptValue: vi.fn(appApi.encryptValue ?? (value => value)),
    getActiveServiceId: vi.fn(appApi.getActiveServiceId ?? (() => Promise.resolve('mock'))),
    getHotkeys: vi.fn(() => Promise.resolve(mockHotkeys)),
    getSettings: vi.fn(appApi.getSettings ?? (() => Promise.resolve(settings))),
    getThemeCss: vi.fn(appApi.getThemeCss ?? (() => Promise.resolve({ css: '', theme: 'light' }))),
    getTranslations: vi.fn(appApi.getTranslations ?? (() => Promise.resolve({}))),
    hideSelect: vi.fn(appApi.hideSelect ?? (() => Promise.resolve(emit('onSelectHide')))),
    logMessage: vi.fn(),
    onAppWindowFocus: vi.fn(),
    onPowerMonitorChange: vi.fn(() => () => {}),
    onSelectChange: vi.fn(
      appApi.onSelectChange ?? (callback => addListener('onSelectChange', callback))
    ),
    onSelectHide: vi.fn(
      appApi.onSelectChange ?? (callback => addListener('onSelectHide', callback))
    ),
    onSelectReset: vi.fn(
      appApi.onSelectReset ?? (callback => addListener('onSelectReset', callback))
    ),
    onServicesChange: vi.fn(
      appApi.onServicesChange ?? (callback => addListener('onServicesChange', callback))
    ),
    onSetSelectItems: vi.fn(
      appApi.onSetSelectItems ?? (callback => addListener('onSetSelectItems', callback))
    ),
    onSettingsChange: vi.fn(
      appApi.onSettingsChange ?? (callback => addListener('onSettingsChange', callback))
    ),
    onShowSelect: vi.fn(appApi.onShowSelect ?? (callback => addListener('onShowSelect', callback))),
    onThemeCssChange: vi.fn(),
    openUrl: vi.fn(),
    quitApp: vi.fn(),
    registerServiceConfig: vi.fn(
      appApi.registerServiceConfig ??
        ((serviceId, { defaults }) =>
          Promise.resolve(
            serviceConfigs[serviceId] ?? mockRegisterServiceConfig(serviceId, defaults)
          ))
    ),
    resetSelect: vi.fn(),
    selectOption: vi.fn(appApi.selectOption ?? (() => Promise.resolve())),
    setActiveServiceId: vi.fn(),
    setSelectBounds: vi.fn(),
    setSelectItems: vi.fn(appApi.setSelectItems ?? (() => Promise.resolve())),
    showAuthWindow: vi.fn(),
    showDashboardWindow: vi.fn(),
    showMessageBox: vi.fn(
      appApi.showMessageBox ?? (() => Promise.resolve({ checkboxChecked: false, response: 0 }))
    ),
    showSelect: vi.fn(appApi.showSelect ?? (() => Promise.resolve())),
    updateSetting: vi.fn(),
    writeClipboardText: vi.fn(),
  };

  window.app = api;

  return [api, emit];
};
