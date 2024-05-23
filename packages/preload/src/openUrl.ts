import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const openUrl = (url: string): void => {
  ipcRenderer.invoke(AppEvent.OpenUrl, url);
};
