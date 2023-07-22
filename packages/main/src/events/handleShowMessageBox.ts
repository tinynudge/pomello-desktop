import { dialog, IpcMainInvokeEvent, MessageBoxOptions, MessageBoxReturnValue } from 'electron';

const handleShowMessageBox = (
  _event: IpcMainInvokeEvent,
  options: MessageBoxOptions
): Promise<MessageBoxReturnValue> => dialog.showMessageBox(options);

export default handleShowMessageBox;
