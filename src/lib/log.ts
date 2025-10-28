import winston from 'winston';

const logger = winston.createLogger({
  defaultMeta: {
    service: 'ug.app',
  },
  format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
  transports: [new winston.transports.Console()],
});

export default logger;
