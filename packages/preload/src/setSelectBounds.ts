import { AppEvent, SetSelectBoundsOptions } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

const setSelectBounds = (options: SetSelectBoundsOptions): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SetSelectBounds, options);

export default setSelectBounds;
