import hideSelectWindow from '@/helpers/hideSelectWindow';
import runtime from '@/runtime';
import { AppEvent } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleOptionSelect = async (_event: IpcMainInvokeEvent, optionId: string): Promise<void> => {
  const appWindow = runtime.windowManager.findOrFailWindow('app');

  appWindow.webContents.send(AppEvent.SelectChange, optionId);

  // Add a small delay to give the app a chance to update while the select
  // window covers the app. This avoids a jarring flash of content when the
  // select window disappears and then the content updates.
  setTimeout(hideSelectWindow, 5);
};

export default handleOptionSelect;
