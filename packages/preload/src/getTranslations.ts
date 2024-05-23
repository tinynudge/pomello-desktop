import { AppEvent, TranslationsDictionary } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const getTranslations = (serviceId?: string): Promise<TranslationsDictionary> =>
  ipcRenderer.invoke(AppEvent.GetTranslations, serviceId);
