import { AppEvent, ShowSelectOptions } from '@domain';
import { ipcRenderer } from 'electron';

const showSelect = (options: ShowSelectOptions): Promise<void> =>
  ipcRenderer.invoke(AppEvent.ShowSelect, options);

export default showSelect;
