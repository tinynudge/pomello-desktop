import getPomelloConfig from '@/helpers/getPomelloConfig';
import windowManager from '@/helpers/windowManager';

const handleAppWindowResize = (): void => {
  const appWindow = windowManager.findOrFailWindow('app');
  const pomelloConfig = getPomelloConfig();

  const [width, height] = appWindow.getSize();

  pomelloConfig.set('width', width);
  pomelloConfig.set('height', height);
};

export default handleAppWindowResize;
