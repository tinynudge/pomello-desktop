import { AppEvent, Settings } from '@domain';
import { ipcRenderer } from 'electron';

const getSettings = (): Promise<Settings> => ipcRenderer.invoke(AppEvent.GetSettings);

export default getSettings;
