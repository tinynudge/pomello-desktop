import { AppEvent } from '@domain';
import { ipcRenderer } from 'electron';

const writeClipboardText = (text: string): void => {
  ipcRenderer.invoke(AppEvent.ClipboardTextWrite, text);
};

export default writeClipboardText;
