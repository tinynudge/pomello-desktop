import { app } from 'electron';
import winston, { format } from 'winston';
import getPomelloConfig from './getPomelloConfig';

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

if (getPomelloConfig().get('debug')) {
  logger.add(
    new winston.transports.File({
      filename: `${app.getPath('userData')}/debug.log`,
      handleExceptions: true,
      level: 'debug',
    })
  );
}

if (import.meta.env.DEV) {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
    })
  );
}

export default logger;
