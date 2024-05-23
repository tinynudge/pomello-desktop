import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const writeClipboardText = (text: string): void => {
  ipcRenderer.invoke(AppEvent.ClipboardTextWrite, text);
};
