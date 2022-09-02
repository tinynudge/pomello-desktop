import { IpcMainEvent, safeStorage } from 'electron';

const handleDecryptValue = (event: IpcMainEvent, value: string): void => {
  const buffer = Buffer.from(value, 'latin1');

  event.returnValue = safeStorage.decryptString(buffer);
};

export default handleDecryptValue;
