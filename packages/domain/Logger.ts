import { LogLevel } from './LogLevel';
import { LogMessage } from './LogMessage';

export type Logger = Record<LogLevel, (message: LogMessage) => void>;
