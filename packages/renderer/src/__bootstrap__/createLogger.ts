import { LogMessage, Logger } from '@domain';

const createLogger = (): Logger => {
  return {
    debug: (message: LogMessage) => window.app.logMessage('debug', message),
    error: (message: LogMessage) => window.app.logMessage('error', message),
    info: (message: LogMessage) => window.app.logMessage('info', message),
    warn: (message: LogMessage) => window.app.logMessage('warn', message),
  };
};

export default createLogger;
