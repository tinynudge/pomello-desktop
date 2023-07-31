import { AppEvent, SetSelectItemsOptions } from '@domain';
import { ipcRenderer } from 'electron';

const setSelectItems = (options: SetSelectItemsOptions): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SetSelectItems, options);

export default setSelectItems;
