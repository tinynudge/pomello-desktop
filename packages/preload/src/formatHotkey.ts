import { AppEvent, FormattedHotkey } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const formatHotkey = (binding: string): FormattedHotkey =>
  ipcRenderer.sendSync(AppEvent.FormatHotkey, binding);
