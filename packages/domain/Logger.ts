import { LogLevel } from './LogLevel';

export type Logger = Record<LogLevel, (message: string) => void>;
