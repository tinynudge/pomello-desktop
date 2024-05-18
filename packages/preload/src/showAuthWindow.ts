import { AppEvent, AuthWindowType } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const showAuthWindow = (authWindow: AuthWindowType): Promise<void> =>
  ipcRenderer.invoke(AppEvent.ShowAuthWindow, authWindow);

export default showAuthWindow;
