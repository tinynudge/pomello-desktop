import { AppEvent, DashboardRoute } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const showDashboardWindow = (route?: DashboardRoute): Promise<void> =>
  ipcRenderer.invoke(AppEvent.ShowDashboardWindow, route);
