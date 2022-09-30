import { AppEvent, ThemeCss } from '@domain';
import { ipcRenderer } from 'electron';

const getThemeCss = (): Promise<ThemeCss> => ipcRenderer.invoke(AppEvent.GetThemeCss);

export default getThemeCss;
