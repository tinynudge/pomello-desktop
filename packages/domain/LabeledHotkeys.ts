import { Hotkeys } from './Hotkeys';

export type LabeledHotkeys = Record<
  keyof Hotkeys,
  {
    binding: string;
    label: string;
  }
>;
