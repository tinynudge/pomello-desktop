import { AppEvent, SetSelectItemsOptions } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const setSelectItems = (options: SetSelectItemsOptions): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SetSelectItems, options);
