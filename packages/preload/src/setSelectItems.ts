import { AppEvent, SetSelectItemsOptions } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const setSelectItems = (options: SetSelectItemsOptions): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SetSelectItems, options);

export default setSelectItems;
