import runtime from '@/runtime';
import { AppEvent, SelectOptionType } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleOptionSelect = async (
  _event: IpcMainInvokeEvent,
  option: SelectOptionType
): Promise<void> => {
  const appWindow = runtime.windowManager.findOrFailWindow('app');

  appWindow.webContents.send(AppEvent.SelectChange, option.id);
};

export default handleOptionSelect;
