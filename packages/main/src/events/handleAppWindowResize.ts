import getPomelloConfig from '@/getPomelloConfig';
import runtime from '@/runtime';

const handleAppWindowResize = (): void => {
  const appWindow = runtime.windowManager.findOrFailWindow('app');
  const pomelloConfig = getPomelloConfig();

  const [width, height] = appWindow.getSize();

  pomelloConfig.set('width', width);
  pomelloConfig.set('height', height);
};

export default handleAppWindowResize;
