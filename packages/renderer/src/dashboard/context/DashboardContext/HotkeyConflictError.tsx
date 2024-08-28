import { FormattedHotkey, HotkeyCommand } from '@pomello-desktop/domain';

type HotkeyConflictErrorProps = {
  currentCommand: HotkeyCommand;
  hotkey: FormattedHotkey;
  incomingCommand: HotkeyCommand;
};

export class HotkeyConflictError extends Error {
  currentCommand: HotkeyCommand;

  hotkey: FormattedHotkey;

  incomingCommand: HotkeyCommand;

  constructor({ currentCommand, hotkey, incomingCommand }: HotkeyConflictErrorProps) {
    super('Duplicate keyboard shortcut found');

    this.currentCommand = currentCommand;
    this.hotkey = hotkey;
    this.incomingCommand = incomingCommand;
  }
}
