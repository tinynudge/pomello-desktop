import { AppEvent, WindowId } from '@pomello-desktop/domain';
import { join } from 'path';
import { throttle } from 'throttle-debounce';
import { version } from '../../../package.json';
import { handleAppQuit } from './events/handleAppQuit';
import { handleAppWindowMove } from './events/handleAppWindowMove';
import { handleAppWindowResize } from './events/handleAppWindowResize';
import { getPomelloConfig } from './getPomelloConfig';
import { getSettings } from './getSettings';
import { hideSelectWindow } from './helpers/hideSelectWindow';
import { runtime } from './runtime';

export const createAppWindows = async (): Promise<void> => {
  const { dev, x, y, width, height } = getPomelloConfig().all();
  const { alwaysOnTop, osxAllowMoveAnywhere } = getSettings().all();

  const showDevTools = import.meta.env.DEV || (dev && /-alpha\.\d+$/.test(version));

  const selectWindow = await runtime.windowManager.findOrCreateWindow({
    alwaysOnTop,
    frame: false,
    id: WindowId.Select,
    modal: true,
    movable: false,
    path: 'select.html',
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    resizable: false,
    showDevTools,
    showOnReady: false,
  });

  const appWindow = await runtime.windowManager.findOrCreateWindow({
    alwaysOnTop,
    frame: false,
    height,
    id: WindowId.App,
    path: 'app.html',
    minHeight: 56,
    minWidth: 230,
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    showDevTools,
    titleBarStyle: osxAllowMoveAnywhere ? 'customButtonsOnHover' : 'default',
    transparent: true,
    webPreferences: {
      backgroundThrottling: false,
    },
    width,
    x,
    y,
  });

  appWindow.on('close', handleAppQuit);
  appWindow.on('move', throttle(250, handleAppWindowMove));
  appWindow.on('resize', throttle(250, handleAppWindowResize));

  selectWindow.setParentWindow(appWindow);
  selectWindow.excludedFromShownWindowsMenu = true;
  selectWindow.on('blur', hideSelectWindow);
  selectWindow.on('close', event => {
    event.preventDefault();
    hideSelectWindow();
  });

  let didSelectWindowBlur = false;

  appWindow.on('focus', () => {
    if (!didSelectWindowBlur) {
      appWindow.webContents.send(AppEvent.AppWindowFocus);
    } else {
      didSelectWindowBlur = false;
    }
  });

  selectWindow.on('blur', () => {
    didSelectWindowBlur = true;
  });

  if (appWindow.isMinimized()) {
    appWindow.restore();
  }

  appWindow.focus();
};
