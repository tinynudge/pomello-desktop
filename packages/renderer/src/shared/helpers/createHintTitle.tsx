import { Translate } from '@pomello-desktop/domain';

export const createHintTitle = (t: Translate, titleKey: string, hotkeyLabel?: string): string => {
  return t('hintTitle', {
    title: t(titleKey),
    hotkey: hotkeyLabel ? t('hintTitleHotkey', { hotkey: hotkeyLabel }) : '',
  });
};
