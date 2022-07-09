import runtime from '@/runtime';
import { AppEvent, ShowSelectOptions } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleShowSelect = async (
  _event: IpcMainInvokeEvent,
  options: ShowSelectOptions
): Promise<void> => {
  const selectWindow = runtime.windowManager.findOrFailWindow('select');

  selectWindow.webContents.send(AppEvent.ShowSelect, options);
};

export default handleShowSelect;
