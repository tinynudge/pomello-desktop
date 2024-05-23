import { dialog, IpcMainInvokeEvent, MessageBoxOptions, MessageBoxReturnValue } from 'electron';

export const handleShowMessageBox = (
  _event: IpcMainInvokeEvent,
  options: MessageBoxOptions
): Promise<MessageBoxReturnValue> => dialog.showMessageBox(options);
