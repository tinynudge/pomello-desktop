import { TranslationsDictionary } from '@domain';

const getTranslations = (): Promise<TranslationsDictionary> => window.app.getTranslations();

export default getTranslations;
