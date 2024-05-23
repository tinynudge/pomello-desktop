import { AppEvent, ThemeCss } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const getThemeCss = (): Promise<ThemeCss> => ipcRenderer.invoke(AppEvent.GetThemeCss);
