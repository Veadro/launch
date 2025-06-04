export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export class Logger {
  private static format(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} - ${level}: ${message}`;
  }

  static info(message: string): void {
    console.log(Logger.format(LogLevel.INFO, message));
  }

  static warn(message: string): void {
    console.warn(Logger.format(LogLevel.WARN, message));
  }

  static error(message: string): void {
    console.error(Logger.format(LogLevel.ERROR, message));
  }
}
