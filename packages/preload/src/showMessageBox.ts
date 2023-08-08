import { AppEvent } from '@domain';
import { ipcRenderer, type MessageBoxOptions, type MessageBoxReturnValue } from 'electron';

const showMessageBox = (options: MessageBoxOptions): Promise<MessageBoxReturnValue> =>
  ipcRenderer.invoke(AppEvent.ShowMessageBox, options);

export default showMessageBox;
