import { SerializableHttpError } from '@/shared/helpers/SerializableHttpError';
import { LogMessage, Logger } from '@pomello-desktop/domain';

const logError = (message: LogMessage, error?: unknown) => {
  const formattedError =
    error instanceof SerializableHttpError
      ? error.toJson()
      : error instanceof Error
        ? JSON.stringify({
            message: error.message,
            stack: error.stack,
          })
        : error;

  window.app.logMessage('error', {
    message,
    error: formattedError,
  });
};

export const createLogger = (): Logger => {
  return {
    debug: window.app.logMessage.bind(null, 'debug'),
    error: logError,
    info: window.app.logMessage.bind(null, 'info'),
    warn: window.app.logMessage.bind(null, 'warn'),
  };
};
