import { IpcMainInvokeEvent, shell } from 'electron';

export const handleOpenUrl = (_event: IpcMainInvokeEvent, url: string) => {
  shell.openExternal(url);
};
