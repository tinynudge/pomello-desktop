import { Translate } from '@pomello-desktop/domain';
import { getTranslations } from './getTranslations';

export const translate: Translate = (key, mappings) => {
  const translations = getTranslations();

  const translation = translations[key];

  if (!translation) {
    return key;
  }

  return mappings
    ? translation.replace(/\{\{(\w+)\}\}/gm, (_match, mapping) => mappings[mapping] ?? mapping)
    : translation;
};
