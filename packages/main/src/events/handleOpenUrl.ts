import { IpcMainInvokeEvent, shell } from 'electron';

const handleOpenUrl = (_event: IpcMainInvokeEvent, url: string) => {
  shell.openExternal(url);
};

export default handleOpenUrl;
