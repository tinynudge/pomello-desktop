import { Logger } from '@domain';

const createLogger = (): Logger => {
  return {
    error: (message: string) => window.app.logMessage('error', message),
    info: (message: string) => window.app.logMessage('info', message),
    warn: (message: string) => window.app.logMessage('warn', message),
  };
};

export default createLogger;
