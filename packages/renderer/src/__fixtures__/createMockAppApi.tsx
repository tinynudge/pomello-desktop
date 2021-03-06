import { Settings } from '@domain';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';

type CallbackFunction = (...args: any[]) => any;

type EventEmitter = (event: string, ...args: unknown[]) => void;

const createMockAppApi = (
  appApi: Partial<AppApi> = {},
  settings: Settings
): [AppApi, EventEmitter] => {
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

    act(() => {
      for (const listener of listeners) {
        listener(...args);
      }
    });
  };

  const api: AppApi = {
    getSettings: vi.fn(appApi.getSettings ?? (() => Promise.resolve(settings))),
    getThemeCss: vi.fn(appApi.getThemeCss ?? (() => Promise.resolve(''))),
    getTranslations: vi.fn(async () => ({})),
    hideSelect: vi.fn(appApi.hideSelect ?? (() => Promise.resolve(emit('onSelectHide')))),
    onThemeCssChange: vi.fn(),
    onSelectChange: vi.fn(
      appApi.onSelectChange ?? (callback => addListener('onSelectChange', callback))
    ),
    onSelectHide: vi.fn(
      appApi.onSelectChange ?? (callback => addListener('onSelectHide', callback))
    ),
    onSetSelectItems: vi.fn(
      appApi.onSetSelectItems ?? (callback => addListener('onSetSelectItems', callback))
    ),
    onShowSelect: vi.fn(appApi.onShowSelect ?? (callback => addListener('onShowSelect', callback))),
    registerStore: vi.fn(),
    selectOption: vi.fn(appApi.selectOption ?? (() => Promise.resolve())),
    setSelectBounds: vi.fn(),
    setSelectItems: vi.fn(appApi.setSelectItems ?? (() => Promise.resolve())),
    showSelect: vi.fn(),
  };

  return [api, emit];
};

export default createMockAppApi;
