import { getPomelloConfig } from '@/getPomelloConfig';
import { runtime } from '@/runtime';
import { WindowId } from '@pomello-desktop/domain';

export const handleAppWindowResize = (): void => {
  const appWindow = runtime.windowManager.findOrFailWindow(WindowId.App);
  const pomelloConfig = getPomelloConfig();

  const [width, height] = appWindow.getSize();

  pomelloConfig.set('width', width);
  pomelloConfig.set('height', height);
};
