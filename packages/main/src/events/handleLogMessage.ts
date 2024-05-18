import logger from '@/logger';
import { LogLevel, LogMessage } from '@pomello-desktop/domain';
import { IpcMainInvokeEvent } from 'electron';

const handleLogMessage = (
  _event: IpcMainInvokeEvent,
  level: LogLevel,
  message: LogMessage
): void => {
  logger[level](message);
};

export default handleLogMessage;
