import { Hotkeys, LabeledHotkeys } from '@pomello-desktop/domain';

const isOsx = process.platform === 'darwin';

const osxTransforms: Record<string, string> = {
  alt: '⌥',
  command: '⌘',
  ctrl: '⌃',
  shift: '⇧',
};

const humanizeBinding = (binding: string): string =>
  binding
    .split('+')
    .map(key => {
      let value = key;

      if (isOsx && osxTransforms[key]) {
        value = osxTransforms[key];
      }

      return value.charAt(0).toUpperCase() + value.slice(1);
    })
    .join(' ');

export const appendHotkeyLabels = (hotkeys: Hotkeys): LabeledHotkeys => {
  return Object.keys(hotkeys).reduce((labeledHotkeys, command) => {
    const binding = hotkeys[command as keyof Hotkeys];

    if (!binding) {
      return labeledHotkeys;
    }

    const label = binding.split(' ').map(humanizeBinding).join(' ');

    return {
      ...labeledHotkeys,
      [command]: {
        binding,
        label,
      },
    };
  }, {} as LabeledHotkeys);
};
