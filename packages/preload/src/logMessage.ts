import { AppEvent, LogLevel } from '@domain';
import { ipcRenderer } from 'electron';

const logMessage = (level: LogLevel, message: string): Promise<void> =>
  ipcRenderer.invoke(AppEvent.LogMessage, level, message);

export default logMessage;
