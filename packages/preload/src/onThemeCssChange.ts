import { AppEvent } from '@domain';
import { ipcRenderer, IpcRendererEvent } from 'electron';

type ThemeCssChangeListener = (themeCss: string) => void;

const onThemeCssChange = (callback: ThemeCssChangeListener) => {
  const handler = (_event: IpcRendererEvent, themeCss: string) => callback(themeCss);

  ipcRenderer.on(AppEvent.ThemeCssChange, handler);
};

export default onThemeCssChange;
