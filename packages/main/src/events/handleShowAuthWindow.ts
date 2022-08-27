import runtime from '@/runtime';
import { IpcMainInvokeEvent } from 'electron';
import { join } from 'path';

const handleShowAuthWindow = async (_event: IpcMainInvokeEvent, serviceId?: string) => {
  const params = serviceId ? `?serviceId=${serviceId}` : '';

  const authWindow = await runtime.windowManager.findOrCreateWindow({
    id: `auth-${serviceId}`,
    path: `auth.html${params}`,
    width: 500,
    height: 590,
    autoHideMenuBar: true,
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    showDevTools: import.meta.env.DEV,
  });

  authWindow.focus();

  authWindow.on('close', () => {
    runtime.windowManager.destroyWindow(`auth-${serviceId}`);
  });
};

export default handleShowAuthWindow;
