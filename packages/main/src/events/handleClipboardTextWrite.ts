import { IpcMainInvokeEvent, clipboard } from 'electron';

const handleClipboardTextWrite = async (
  _event: IpcMainInvokeEvent,
  text: string
): Promise<void> => {
  clipboard.writeText(text);
};

export default handleClipboardTextWrite;
