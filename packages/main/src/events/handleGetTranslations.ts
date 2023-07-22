import getTranslations from '@/helpers/getTranslations';
import { TranslationsDictionary } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleGetTranslations = async (
  _event: IpcMainInvokeEvent,
  serviceId?: string
): Promise<TranslationsDictionary> => getTranslations(serviceId);

export default handleGetTranslations;
