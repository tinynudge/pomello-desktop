import { app } from 'electron';
import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: `${app.getPath('userData')}/errors.log`,
      handleExceptions: true,
      level: 'warn',
    }),
  ],
  exitOnError: false,
});

if (import.meta.env.DEV) {
  logger.add(
    new winston.transports.Console({
      level: 'verbose',
    })
  );
}

export default logger;
