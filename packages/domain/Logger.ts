import type { LogLevel, LogMessage } from '@domain';

export type Logger = Record<LogLevel, (message: LogMessage) => void>;
