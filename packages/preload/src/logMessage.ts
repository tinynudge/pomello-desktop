import { AppEvent, LogLevel, LogMessage } from '@domain';
import { ipcRenderer } from 'electron';

const logMessage = (level: LogLevel, message: LogMessage): Promise<void> =>
  ipcRenderer.invoke(AppEvent.LogMessage, level, message);

export default logMessage;
