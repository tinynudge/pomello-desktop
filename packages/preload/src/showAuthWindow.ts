import { ipcRenderer } from 'electron';
import { AppEvent } from '../../domain/AppEvent';

const showAuthWindow = (serviceId?: string): Promise<void> =>
  ipcRenderer.invoke(AppEvent.ShowAuthWindow, serviceId);

export default showAuthWindow;
