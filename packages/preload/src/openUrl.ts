import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const openUrl = (url: string): void => {
  ipcRenderer.invoke(AppEvent.OpenUrl, url);
};

export default openUrl;
