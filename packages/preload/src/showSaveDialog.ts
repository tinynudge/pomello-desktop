import { AppEvent, ShowSaveDialogOptions } from '@pomello-desktop/domain';
import { ipcRenderer } from 'electron';

export const showSaveDialog = (options: ShowSaveDialogOptions): Promise<string | null> =>
  ipcRenderer.invoke(AppEvent.ShowSaveDialog, options);
