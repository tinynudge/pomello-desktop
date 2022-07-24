import { AppEvent } from '@domain';
import { ipcRenderer } from 'electron';

const selectOption = (optionId: string): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SelectOption, optionId);

export default selectOption;
