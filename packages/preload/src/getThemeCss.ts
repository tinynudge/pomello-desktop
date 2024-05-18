import { AppEvent, ThemeCss } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const getThemeCss = (): Promise<ThemeCss> => ipcRenderer.invoke(AppEvent.GetThemeCss);

export default getThemeCss;
