import { runtime } from '@/runtime';
import { AppEvent, WindowId } from '@pomello-desktop/domain';

export const hideSelectWindow = () => {
  const selectWindow = runtime.windowManager.findOrFailWindow(WindowId.Select);

  selectWindow.hide();

  selectWindow.webContents.send(AppEvent.HideSelect);
};
