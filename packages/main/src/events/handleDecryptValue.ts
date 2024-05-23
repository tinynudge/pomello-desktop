import { logger } from '@/logger';
import { IpcMainEvent, safeStorage } from 'electron';

export const handleDecryptValue = (event: IpcMainEvent, value: string): void => {
  const buffer = Buffer.from(value, 'latin1');

  let decryptedValue: string | null = null;

  try {
    decryptedValue = safeStorage.decryptString(buffer);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Unable to decrypt value: "${error.message}"`);
    }
  }

  event.returnValue = decryptedValue;
};
