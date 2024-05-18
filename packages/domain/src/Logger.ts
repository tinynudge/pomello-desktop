import { LogMessage } from './LogMessage';

export type Logger = {
  debug(message: LogMessage): void;
  error(message: LogMessage, error?: unknown): void;
  info(message: LogMessage): void;
  warn(message: LogMessage): void;
};
