import { getPomelloConfig } from '@/getPomelloConfig';
import { runtime } from '@/runtime';
import { DashboardRoute, WindowId } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';
import { join } from 'path';
import { throttle } from 'throttle-debounce';
import { version } from '../../../../package.json';
import { handleDashboardWindowMove } from './handleDashboardWindowMove';
import { handleDashboardWindowResize } from './handleDashboardWindowResize';

export const handleShowDashboardWindow = async (
  _event: IpcMainInvokeEvent,
  route?: DashboardRoute
) => {
  const { dashboardHeight, dashboardWidth, dashboardX, dashboardY, dev } = getPomelloConfig().all();
  const showDevTools = import.meta.env.DEV || (dev && /-alpha\.\d+$/.test(version));

  let path = 'dashboard.html';
  if (route) {
    path += `#${route}`;
  }

  const dashboardWindow = await runtime.windowManager.findOrCreateWindow({
    height: dashboardHeight,
    id: WindowId.Dashboard,
    path,
    preloadPath: join(__dirname, '../../preload/dist/index.cjs'),
    showDevTools,
    width: dashboardWidth,
    x: dashboardX,
    y: dashboardY,
  });

  dashboardWindow.on('resize', throttle(250, handleDashboardWindowResize));
  dashboardWindow.on('move', throttle(250, handleDashboardWindowMove));

  dashboardWindow.on('close', () => {
    runtime.windowManager.destroyWindow(WindowId.Dashboard);
  });

  dashboardWindow.focus();
};
