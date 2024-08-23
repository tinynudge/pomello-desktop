import { FormattedHotkey } from './FormattedHotkey';
import { HotkeyCommand } from './HotkeyCommand';

export type FormattedHotkeys = Partial<Record<HotkeyCommand, FormattedHotkey>>;
