import runtime from '@/runtime';
import { AppEvent, SetSelectItemsOptions } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleSetSelectItems = async (
  _event: IpcMainInvokeEvent,
  options: SetSelectItemsOptions
): Promise<void> => {
  const selectWindow = runtime.windowManager.findOrFailWindow('select');

  selectWindow.webContents.send(AppEvent.SetSelectItems, options);
};

export default handleSetSelectItems;
