import { join } from 'path';
import getPomelloConfig from './getPomelloConfig';
import getSettings from './getSettings';
import hideSelectWindow from './helpers/hideSelectWindow';
import runtime from './runtime';

const createAppWindows = async (): Promise<void> => {
  const { x, y, width, height } = getPomelloConfig().all();
  const { alwaysOnTop, osxAllowMoveAnywhere } = getSettings().all();

  const selectWindow = await runtime.windowManager.findOrCreateWindow({
    alwaysOnTop,
    frame: false,
    id: 'select',
    modal: true,
    movable: false,
    path: 'select.html',
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    resizable: false,
    showDevTools: true,
    showOnReady: false,
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

  selectWindow.setParentWindow(appWindow);
  selectWindow.excludedFromShownWindowsMenu = true;
  selectWindow.on('blur', hideSelectWindow);

  // This seems to avoid the visual flash between when the select window changes
  // from hidden to visible and the subsequent browser paint.
  selectWindow.webContents.incrementCapturerCount();

  if (appWindow.isMinimized()) {
    appWindow.restore();
  }

  appWindow.focus();
};

export default createAppWindows;
