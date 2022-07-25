import { AppEvent } from '@domain';
import { ipcRenderer, Rectangle } from 'electron';

const setSelectBounds = (options: Partial<Rectangle>): Promise<void> =>
  ipcRenderer.invoke(AppEvent.SetSelectBounds, options);

export default setSelectBounds;
