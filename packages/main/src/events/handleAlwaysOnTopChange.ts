import { runtime } from '@/runtime';

export const handleAlwaysOnTopChange = (value?: boolean): void => {
  if (value === undefined) {
    return;
  }

  const appWindow = runtime.windowManager.findOrFailWindow('app');

  appWindow.setAlwaysOnTop(value);
};
