import { runtime } from '@/runtime';
import { WindowId } from '@pomello-desktop/domain';

export const handleAppQuit = (): void => {
  const appWindow = runtime.windowManager.findOrFailWindow(WindowId.App);
  const windows = runtime.windowManager.getAllWindows();

  // Make sure we destroy the app window last
  windows.filter(window => window !== appWindow).forEach(window => window.destroy());

  appWindow.destroy();
};
