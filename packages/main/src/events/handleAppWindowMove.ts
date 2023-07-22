import getPomelloConfig from '@/helpers/getPomelloConfig';
import getSettings from '@/helpers/getSettings';
import snapAppWindowToDisplayEdge from '@/helpers/snapAppWindowToDisplayEdge';
import windowManager from '@/helpers/windowManager';

const handleAppWindowMove = (): void => {
  const appWindow = windowManager.findOrFailWindow('app');
  const pomelloConfig = getPomelloConfig();
  const settings = getSettings();

  if (settings.get('snapEdges')) {
    snapAppWindowToDisplayEdge();
  }

  const [x, y] = appWindow.getPosition();

  pomelloConfig.set('x', x);
  pomelloConfig.set('y', y);
};

export default handleAppWindowMove;
