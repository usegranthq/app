import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
  base: {
    service: 'ug.logger',
  },
});

export default logger;
