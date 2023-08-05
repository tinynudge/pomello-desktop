import hideSelectWindow from '@/helpers/hideSelectWindow';
import windowManager from '@/helpers/windowManager';
import { AppEvent } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleSelectChange = async (_event: IpcMainInvokeEvent, optionId: string): Promise<void> => {
  const appWindow = windowManager.findOrFailWindow('app');

  appWindow.webContents.send(AppEvent.SelectChange, optionId);

  // Add a small delay to give the app a chance to update while the select
  // window covers the app. This avoids a jarring flash of content when the
  // select window disappears and then the content updates.
  setTimeout(hideSelectWindow, 5);
};

export default handleSelectChange;
