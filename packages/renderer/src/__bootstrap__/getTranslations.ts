import { Translations } from '@domain';

const getTranslations = (): Promise<Translations> => window.app.getTranslations();

export default getTranslations;
