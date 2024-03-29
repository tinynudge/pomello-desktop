import { join } from 'path';
import { throttle } from 'throttle-debounce';
import { version } from '../../../../package.json';
import handleAppWindowMove from '../events/handleAppWindowMove';
import handleAppWindowResize from '../events/handleAppWindowResize';
import getPomelloConfig from './getPomelloConfig';
import getSettings from './getSettings';
import windowManager from './windowManager';
import hideSelectWindow from './hideSelectWindow';

const createAppWindows = async (): Promise<void> => {
  const { dev, x, y, width, height } = getPomelloConfig().all();
  const { alwaysOnTop, osxAllowMoveAnywhere } = getSettings().all();

  const showDevTools = import.meta.env.DEV || (dev && /-alpha\.\d+$/.test(version));

  const selectWindow = await windowManager.findOrCreateWindow({
    alwaysOnTop,
    frame: false,
    id: 'select',
    modal: true,
    movable: false,
    path: 'select.html',
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    resizable: false,
    showDevTools,
    showOnReady: false,
  });

  const appWindow = await windowManager.findOrCreateWindow({
    alwaysOnTop,
    frame: false,
    height,
    id: 'app',
    path: 'app.html',
    minHeight: 56,
    minWidth: 230,
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    showDevTools,
    titleBarStyle: osxAllowMoveAnywhere ? 'customButtonsOnHover' : 'default',
    transparent: true,
    width,
    x,
    y,
  });

  appWindow.on('resize', throttle(250, handleAppWindowResize));
  appWindow.on('move', throttle(250, handleAppWindowMove));

  selectWindow.setParentWindow(appWindow);
  selectWindow.excludedFromShownWindowsMenu = true;
  selectWindow.on('blur', () => hideSelectWindow());

  if (appWindow.isMinimized()) {
    appWindow.restore();
  }

  appWindow.focus();
};

export default createAppWindows;
