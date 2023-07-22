import { app } from 'electron';
import winston, { format } from 'winston';

const logger = winston.createLogger({
  format: format.combine(format.timestamp(), format.prettyPrint()),
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
      level: 'debug',
    })
  );
}

export default logger;
