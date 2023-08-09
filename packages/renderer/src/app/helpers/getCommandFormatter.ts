import { getHotkeysContext } from '@/app/contexts/hotkeysContext';
import type { LabeledHotkeys, Translate } from '@domain';

const getCommandFormatter = (translate: Translate) => {
  const hotkeys = getHotkeysContext();

  const formatCommand = (titleKey: string, command: keyof LabeledHotkeys) => {
    const hotkeyLabel = hotkeys[command]?.label;

    return translate('hintTitle', {
      title: translate(titleKey),
      hotkey: hotkeyLabel ? translate('hintTitleHotkey', { hotkey: hotkeyLabel }) : '',
    });
  };

  return formatCommand;
};

export default getCommandFormatter;
