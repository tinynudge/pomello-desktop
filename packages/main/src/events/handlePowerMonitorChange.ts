import { runtime } from '@/runtime';
import { AppEvent } from '@pomello-desktop/domain';

export const handlePowerMonitorChange = (status: 'resume' | 'suspend'): void => {
  const appWindow = runtime.windowManager.findOrFailWindow('app');

  appWindow.webContents.send(AppEvent.PowerMonitorChange, status);
};
