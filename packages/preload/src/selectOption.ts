import { AppEvent } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const selectOption = (optionId: string): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SelectOption, optionId);
