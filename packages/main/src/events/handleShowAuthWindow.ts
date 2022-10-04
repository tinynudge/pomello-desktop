import runtime from '@/runtime';
import { AuthWindowType } from '@domain';
import { IpcMainInvokeEvent } from 'electron';
import { join } from 'path';

const handleShowAuthWindow = async (_event: IpcMainInvokeEvent, windowType: AuthWindowType) => {
  const windowId =
    windowType.type === 'pomello'
      ? `auth-pomello-${windowType.action}`
      : `auth-service-${windowType.serviceId}`;

  const authWindow = await runtime.windowManager.findOrCreateWindow({
    id: windowId,
    path: `auth.html?auth=${JSON.stringify(windowType)}`,
    width: 500,
    height: 590,
    autoHideMenuBar: true,
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    showDevTools: import.meta.env.DEV,
  });

  authWindow.focus();

  authWindow.on('close', () => {
    runtime.windowManager.destroyWindow(windowId);
  });
};

export default handleShowAuthWindow;
