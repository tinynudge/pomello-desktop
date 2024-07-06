import { getPomelloConfig } from '@/getPomelloConfig';
import { runtime } from '@/runtime';
import { WindowId } from '@pomello-desktop/domain';

export const handleDashboardWindowResize = (): void => {
  const dashboardWindow = runtime.windowManager.findOrFailWindow(WindowId.Dashboard);
  const pomelloConfig = getPomelloConfig();

  const [width, height] = dashboardWindow.getSize();

  pomelloConfig.set('dashboardWidth', width);
  pomelloConfig.set('dashboardHeight', height);
};
