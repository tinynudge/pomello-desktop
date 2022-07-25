import { AppEvent, SetSelectBoundsOptions } from '@domain';
import { ipcRenderer } from 'electron';

const setSelectBounds = (options: SetSelectBoundsOptions): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SetSelectBounds, options);

export default setSelectBounds;
