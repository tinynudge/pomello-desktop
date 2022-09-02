import { IpcMainEvent, safeStorage } from 'electron';

const handleEncryptValue = (event: IpcMainEvent, value: string): void => {
  event.returnValue = safeStorage.encryptString(value).toString('latin1');
};

export default handleEncryptValue;
