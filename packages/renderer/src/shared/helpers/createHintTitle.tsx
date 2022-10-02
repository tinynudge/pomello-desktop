import { Translate } from '@domain';

const createHintTitle = (t: Translate, titleKey: string, hotkeyLabel?: string): string => {
  return t('hintTitle', {
    title: t(titleKey),
    hotkey: hotkeyLabel ? t('hintTitleHotkey', { hotkey: hotkeyLabel }) : '',
  });
};

export default createHintTitle;
