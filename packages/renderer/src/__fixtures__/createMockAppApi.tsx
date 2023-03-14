import { ServiceConfigActions, Settings } from '@domain';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import mockRegisterServiceConfig from './mockRegisterServiceConfig';
import mockHotkeys from './mockHotkeys';

type CallbackFunction = (...args: any[]) => any;

type EventEmitter = (event: string, ...args: unknown[]) => void;

interface CreateMockAppApiOptions {
  appApi?: Partial<AppApi>;
  serviceConfigs?: Record<string, ServiceConfigActions<any>>;
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

  const emit = (event: string, ...args: any[]) => {
    const listeners = listenersMap.get(event) ?? [];

    for (const listener of listeners) {
      act(() => {
        listener(...args);
      });
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
    notifySelectReady: vi.fn(),
    onThemeCssChange: vi.fn(),
    onSelectChange: vi.fn(
      appApi.onSelectChange ?? (callback => addListener('onSelectChange', callback))
    ),
    onSelectHide: vi.fn(
      appApi.onSelectChange ?? (callback => addListener('onSelectHide', callback))
    ),
    onSelectReady: vi.fn(
      appApi.onSelectReady ?? (callback => addListener('onSelectReady', callback))
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
    showMessageBox: vi.fn(
      appApi.showMessageBox ?? (() => Promise.resolve({ checkboxChecked: false, response: 0 }))
    ),
    showSelect: vi.fn(appApi.showSelect ?? (() => Promise.resolve())),
    updateSetting: vi.fn(),
    writeClipboardText: vi.fn(),
  };

  return [api, emit];
};

export default createMockAppApi;
