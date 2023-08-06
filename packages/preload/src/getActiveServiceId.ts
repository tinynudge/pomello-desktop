import { AppEvent } from '@domain';
import { ipcRenderer } from 'electron';

const getActiveServiceId = (): Promise<string | undefined> =>
  ipcRenderer.invoke(AppEvent.GetActiveServiceId);

export default getActiveServiceId;
