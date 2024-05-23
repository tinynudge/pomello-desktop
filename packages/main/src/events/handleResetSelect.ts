import { runtime } from '@/runtime';
import { AppEvent } from '@pomello-desktop/domain';

export const handleResetSelect = async (): Promise<void> => {
  const select = runtime.windowManager.findOrFailWindow('select');

  select.webContents.send(AppEvent.ResetSelect);
};
