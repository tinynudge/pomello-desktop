import { AppEvent } from '@domain';
import { ipcRenderer, MessageBoxOptions, MessageBoxReturnValue } from 'electron';

const showMessageBox = (options: MessageBoxOptions): Promise<MessageBoxReturnValue> =>
  ipcRenderer.invoke(AppEvent.ShowMessageBox, options);

export default showMessageBox;
