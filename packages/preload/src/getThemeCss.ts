import { AppEvent } from '@domain';
import { ipcRenderer } from 'electron';

const getThemeCss = (): Promise<string> => ipcRenderer.invoke(AppEvent.GetThemeCss);

export default getThemeCss;
