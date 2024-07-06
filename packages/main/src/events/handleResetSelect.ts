import { runtime } from '@/runtime';
import { AppEvent, WindowId } from '@pomello-desktop/domain';

export const handleResetSelect = async (): Promise<void> => {
  const select = runtime.windowManager.findOrFailWindow(WindowId.Select);

  select.webContents.send(AppEvent.ResetSelect);
};
