import { AppEvent, TranslationsDictionary } from '@domain';
import { ipcRenderer } from 'electron';

const getTranslations = (serviceId?: string): Promise<TranslationsDictionary> =>
  ipcRenderer.invoke(AppEvent.GetTranslations, serviceId);

export default getTranslations;
