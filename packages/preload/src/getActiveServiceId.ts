import { ipcRenderer } from 'electron';
import { AppEvent } from '../../domain/AppEvent';

const getActiveServiceId = (): Promise<string | undefined> =>
  ipcRenderer.invoke(AppEvent.GetActiveServiceId);

export default getActiveServiceId;
