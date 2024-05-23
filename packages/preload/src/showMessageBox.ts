import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer, MessageBoxOptions, MessageBoxReturnValue } from 'electron';

export const showMessageBox = (options: MessageBoxOptions): Promise<MessageBoxReturnValue> =>
  ipcRenderer.invoke(AppEvent.ShowMessageBox, options);
