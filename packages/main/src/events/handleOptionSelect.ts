import hideSelectWindow from '@/helpers/hideSelectWindow';
import runtime from '@/runtime';
import { AppEvent } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleOptionSelect = async (_event: IpcMainInvokeEvent, optionId: string): Promise<void> => {
  const appWindow = runtime.windowManager.findOrFailWindow('app');

  appWindow.webContents.send(AppEvent.SelectChange, optionId);

  hideSelectWindow();
};

export default handleOptionSelect;
