import { Logger } from './utils/log';

process.on('uncaughtException', (err: unknown) => {
  Logger.error(`Unhandled exception: ${err instanceof Error ? err.stack : err}`);
});

process.on('unhandledRejection', (reason: unknown) => {
  Logger.error(`Unhandled rejection: ${reason}`);
});

Logger.info('LaunchServer starting');

setInterval(() => {
  Logger.info('Server heartbeat');
}, 60000);
