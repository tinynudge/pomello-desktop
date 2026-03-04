import { AppEvent, WriteFileOptions } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const writeFile = (options: WriteFileOptions): Promise<void> =>
  ipcRenderer.invoke(AppEvent.WriteFile, options);
