import { AppEvent, ShowSelectMainOptions } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const showSelect = (options: ShowSelectMainOptions): Promise<void> =>
  ipcRenderer.invoke(AppEvent.ShowSelect, options);

export default showSelect;
