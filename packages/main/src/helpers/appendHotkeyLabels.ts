import { Hotkeys, LabeledHotkeys } from '@pomello-desktop/domain';

const isOsx = process.platform === 'darwin';

const osxTransforms: Record<string, string> = {
  alt: '⌥',
  command: '⌘',
  ctrl: '⌃',
  shift: '⇧',
};

const humanizeBinding = (binding: string): string[] =>
  binding.split('+').map(key => {
    if (isOsx && osxTransforms[key]) {
      return osxTransforms[key];
    }

    return key.charAt(0).toUpperCase() + key.slice(1);
  });

export const appendHotkeyLabels = (hotkeys: Hotkeys): LabeledHotkeys => {
  return Object.keys(hotkeys).reduce((labeledHotkeys, command) => {
    const binding = hotkeys[command as keyof Hotkeys];

    if (!binding) {
      return labeledHotkeys;
    }

    const keys = binding.split(' ').map(humanizeBinding);

    const label = keys.map(chord => chord.join(' ')).join(' • ');

    return {
      ...labeledHotkeys,
      [command]: {
        binding,
        keys,
        label,
      },
    };
  }, {} as LabeledHotkeys);
};
