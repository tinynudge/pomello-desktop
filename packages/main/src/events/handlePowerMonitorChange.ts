import { runtime } from '@/runtime';
import { AppEvent, WindowId } from '@pomello-desktop/domain';

export const handlePowerMonitorChange = (status: 'resume' | 'suspend'): void => {
  const appWindow = runtime.windowManager.findOrFailWindow(WindowId.App);

  appWindow.webContents.send(AppEvent.PowerMonitorChange, status);
};
