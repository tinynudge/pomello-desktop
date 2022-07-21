import { AppEvent, Translations } from '@domain';
import { ipcRenderer } from 'electron';

const getTranslations = (): Promise<Translations> => ipcRenderer.invoke(AppEvent.GetTranslations);

export default getTranslations;
