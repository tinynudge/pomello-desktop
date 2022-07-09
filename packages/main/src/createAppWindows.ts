import { join } from 'path';
import getPomelloConfig from './getPomelloConfig';
import getSettings from './getSettings';
import runtime from './runtime';

const createAppWindows = async (): Promise<void> => {
  const { x, y, width, height } = getPomelloConfig().all();
  const { alwaysOnTop, osxAllowMoveAnywhere } = getSettings().all();

  const selectWindow = await runtime.windowManager.findOrCreateWindow({
    alwaysOnTop: true,
    frame: false,
    height: 140,
    id: 'select',
    path: 'select.html',
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    showDevTools: true,
    width,
  });

  const appWindow = await runtime.windowManager.findOrCreateWindow({
    alwaysOnTop,
    frame: false,
    height,
    id: 'app',
    path: 'app.html',
    minHeight: 56,
    minWidth: 230,
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    showDevTools: true,
    titleBarStyle: osxAllowMoveAnywhere ? 'customButtonsOnHover' : 'default',
    transparent: true,
    width,
    x,
    y,
  });

  selectWindow.excludedFromShownWindowsMenu = true;

  if (appWindow.isMinimized()) {
    appWindow.restore();
  }

  appWindow.focus();
};

export default createAppWindows;
