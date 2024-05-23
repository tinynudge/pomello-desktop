import { runtime } from '@/runtime';
import { AppEvent, SetSelectItemsOptions } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';

export const handleSetSelectItems = async (
  _event: IpcMainInvokeEvent,
  options: SetSelectItemsOptions
): Promise<void> => {
  const selectWindow = runtime.windowManager.findOrFailWindow('select');

  selectWindow.webContents.send(AppEvent.SetSelectItems, options);
};
