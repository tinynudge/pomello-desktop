import runtime from '@/runtime';

const handleAppQuit = (): void => {
  const appWindow = runtime.windowManager.findOrFailWindow('app');
  const windows = runtime.windowManager.getAllWindows();

  // Make sure we destroy the app window last
  windows.filter(window => window !== appWindow).forEach(window => window.destroy());

  appWindow.destroy();
};

export default handleAppQuit;
