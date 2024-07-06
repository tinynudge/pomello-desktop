import { runtime } from '@/runtime';
import { AppEvent, SetSelectItemsOptions, WindowId } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';

export const handleSetSelectItems = async (
  _event: IpcMainInvokeEvent,
  options: SetSelectItemsOptions
): Promise<void> => {
  const selectWindow = runtime.windowManager.findOrFailWindow(WindowId.Select);

  selectWindow.webContents.send(AppEvent.SetSelectItems, options);
};
