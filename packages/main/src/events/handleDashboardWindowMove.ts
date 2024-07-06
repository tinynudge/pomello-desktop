import { getPomelloConfig } from '@/getPomelloConfig';
import { runtime } from '@/runtime';
import { WindowId } from '@pomello-desktop/domain';

export const handleDashboardWindowMove = (): void => {
  const dashboardWindow = runtime.windowManager.findOrFailWindow(WindowId.Dashboard);
  const pomelloConfig = getPomelloConfig();

  const [x, y] = dashboardWindow.getPosition();

  pomelloConfig.set('dashboardX', x);
  pomelloConfig.set('dashboardY', y);
};
