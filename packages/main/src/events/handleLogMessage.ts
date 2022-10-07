import logger from '@/logger';
import { LogLevel } from '@domain';
import { IpcMainInvokeEvent } from 'electron';

const handleLogMessage = (_event: IpcMainInvokeEvent, level: LogLevel, message: string): void => {
  logger[level](message);
};

export default handleLogMessage;
