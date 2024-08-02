import { AppEvent, TranslationLocation, TranslationsDictionary } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const getTranslations = (location: TranslationLocation): Promise<TranslationsDictionary> =>
  ipcRenderer.invoke(AppEvent.GetTranslations, location);
