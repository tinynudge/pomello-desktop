import { getTranslations } from '@/helpers/getTranslations';
import { TranslationLocation, TranslationsDictionary } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';

export const handleGetTranslations = async (
  _event: IpcMainInvokeEvent,
  location: TranslationLocation
): Promise<TranslationsDictionary> => getTranslations(location);
