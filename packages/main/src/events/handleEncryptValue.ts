import { IpcMainEvent, safeStorage } from 'electron';

export const handleEncryptValue = (event: IpcMainEvent, value: string): void => {
  event.returnValue = safeStorage.encryptString(value).toString('latin1');
};
