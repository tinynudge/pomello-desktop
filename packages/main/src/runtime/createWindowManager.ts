import { FindOrCreateWindowOptions, WindowManager } from '@pomello-desktop/domain';
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';

const createWindowManager = (): WindowManager => {
  const windows: Map<string, BrowserWindow> = new Map();

  const destroyWindow = (id: string): void => {
    const window = windows.get(id);

    if (window) {
      window.destroy();

      windows.delete(id);
    }
  };

  const findOrCreateWindow = async ({
    id,
    path,
    preloadPath,
    showDevTools = false,
    showOnReady = true,
    ...browserWindowOptions
  }: FindOrCreateWindowOptions): Promise<BrowserWindow> => {
    const window = windows.get(id);

    if (window) {
      return window;
    }

    const options: BrowserWindowConstructorOptions = {
      ...browserWindowOptions,
      show: false,
    };

    if (preloadPath) {
      options.webPreferences = {
        preload: preloadPath,
      };
    }

    const browserWindow = new BrowserWindow(options);

    browserWindow.on('ready-to-show', () => {
      if (showOnReady) {
        browserWindow.show();
      }

      if (showDevTools) {
        browserWindow.webContents.openDevTools({ mode: 'undocked' });
      }
    });

    const windowUrl =
      import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
        ? `${import.meta.env.VITE_DEV_SERVER_URL}/${path}`
        : new URL(`../renderer/dist/${path}`, `file://${__dirname}`).toString();

    await browserWindow.loadURL(windowUrl);

    windows.set(id, browserWindow);

    return browserWindow;
  };

  const findOrFailWindow = (id: string): BrowserWindow => {
    const window = windows.get(id);

    if (!window) {
      throw new Error(`Unable to find window with id "${id}".`);
    }

    return window;
  };

  const getAllWindows = (): BrowserWindow[] => {
    return Array.from(windows.values());
  };

  const getWindow = (id: string): BrowserWindow | undefined => {
    return windows.get(id);
  };

  return {
    destroyWindow,
    findOrCreateWindow,
    findOrFailWindow,
    getAllWindows,
    getWindow,
  };
};

export default createWindowManager;
