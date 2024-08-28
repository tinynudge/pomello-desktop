import { FormattedHotkey } from '@pomello-desktop/domain';

const isOsx = process.platform === 'darwin';

const osxTransforms: Record<string, string> = {
  alt: '⌥',
  command: '⌘',
  ctrl: '⌃',
  meta: '⌘',
  shift: '⇧',
};

const humanizeBinding = (binding: string): string[] => {
  return binding.split('+').map(key => {
    if (isOsx && osxTransforms[key]) {
      return osxTransforms[key];
    }

    return key.charAt(0).toUpperCase() + key.slice(1);
  });
};

export const formatHotkey = (binding: string): FormattedHotkey => {
  const keys = binding.split(' ').map(humanizeBinding);

  const label = keys.map(sequence => sequence.join(' ')).join(' • ');

  return {
    binding,
    keys,
    label,
  };
};
