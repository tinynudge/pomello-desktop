import { HotkeyCommand } from './HotkeyCommand';

export type LabeledHotkeys = Partial<
  Record<
    HotkeyCommand,
    {
      binding: string;
      label: string;
    }
  >
>;
