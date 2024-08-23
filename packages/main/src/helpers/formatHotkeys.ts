import { FormattedHotkeys, Hotkeys } from '@pomello-desktop/domain';
import { formatHotkey } from './formatHotkey';

export const formatHotkeys = (hotkeys: Hotkeys): FormattedHotkeys => {
  return Object.keys(hotkeys).reduce((labeledHotkeys, command) => {
    const binding = hotkeys[command as keyof Hotkeys];

    if (!binding) {
      return labeledHotkeys;
    }

    return {
      ...labeledHotkeys,
      [command]: formatHotkey(binding),
    };
  }, {} as FormattedHotkeys);
};
