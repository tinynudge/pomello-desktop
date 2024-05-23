import { getPomelloConfig } from '@/getPomelloConfig';
import { getSettings } from '@/getSettings';
import { snapAppWindowToDisplayEdge } from '@/helpers/snapAppWindowToDisplayEdge';
import { runtime } from '@/runtime';

export const handleAppWindowMove = (): void => {
  const appWindow = runtime.windowManager.findOrFailWindow('app');
  const pomelloConfig = getPomelloConfig();
  const settings = getSettings();

  if (settings.get('snapEdges')) {
    snapAppWindowToDisplayEdge();
  }

  const [x, y] = appWindow.getPosition();

  pomelloConfig.set('x', x);
  pomelloConfig.set('y', y);
};
