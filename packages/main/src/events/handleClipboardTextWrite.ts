import { IpcMainInvokeEvent, clipboard } from 'electron';

export const handleClipboardTextWrite = async (
  _event: IpcMainInvokeEvent,
  text: string
): Promise<void> => {
  clipboard.writeText(text);
};
