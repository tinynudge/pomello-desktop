import { AppEvent, type SetSelectBoundsParams } from '@domain';
import { ipcRenderer } from 'electron';

const setSelectBounds = (options: SetSelectBoundsParams): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SetSelectBounds, options);

export default setSelectBounds;
