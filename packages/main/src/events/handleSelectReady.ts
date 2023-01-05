import runtime from '@/runtime';
import { AppEvent } from '@domain';

const handleSelectReady = async (): Promise<void> => {
  const app = runtime.windowManager.getWindow('app');

  if (app) {
    app.webContents.send(AppEvent.SelectReady);
  }
};

export default handleSelectReady;
