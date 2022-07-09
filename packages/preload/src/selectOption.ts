import { AppEvent, SelectOptionType } from '@domain';
import { ipcRenderer } from 'electron';

const selectOption = (option: SelectOptionType): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SelectOption, option);

export default selectOption;
