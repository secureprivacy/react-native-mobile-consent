/**
 * SPLogger
 *
 * Internal logger utility for Secure Privacy SDK (React Native).
 * Logs are disabled by default and can be enabled at build time.
 */
export class SPLogger {
  /** Master switch for internal SDK logs */
  private static readonly _internalLogsEnabled: boolean = false;

  /** Log level switches */
  static errorLogsEnabled: boolean = SPLogger._internalLogsEnabled;
  static infoLogsEnabled: boolean = SPLogger._internalLogsEnabled;
  static warningLogsEnabled: boolean = SPLogger._internalLogsEnabled;

  /**
   * Debug log
   */
  static d(tag: string, msg: string): void {
    if (!SPLogger._internalLogsEnabled) return;
    // eslint-disable-next-line no-console
    console.debug(`[DEBUG][${tag}]: ${msg}`);
  }

  /**
   * Debug log with error / exception
   */
  static de(
    tag: string,
    msg: string,
    error?: unknown,
    stack?: unknown
  ): void {
    if (!SPLogger._internalLogsEnabled) return;

    // eslint-disable-next-line no-console
    console.debug(`[DEBUG-ERROR][${tag}]: ${msg}`);

    if (error) {
      // eslint-disable-next-line no-console
      console.debug(`Error:`, error);
    }

    if (stack) {
      // eslint-disable-next-line no-console
      console.debug(`StackTrace:`, stack);
    }
  }

  /**
   * Error log
   */
  static e(
    tag: string,
    msg: string,
    error?: unknown,
    stack?: unknown
  ): void {
    if (!SPLogger.errorLogsEnabled) return;

    // eslint-disable-next-line no-console
    console.error(`[ERROR][${tag}]: ${msg}`);

    if (error) {
      // eslint-disable-next-line no-console
      console.error(`Error:`, error);
    }

    if (stack) {
      // eslint-disable-next-line no-console
      console.error(`StackTrace:`, stack);
    }
  }

  /**
   * Info log
   */
  static i(tag: string, msg: string): void {
    if (!SPLogger.infoLogsEnabled) return;
    // eslint-disable-next-line no-console
    console.info(`[INFO][${tag}]: ${msg}`);
  }

  /**
   * Warning log
   */
  static w(tag: string, msg: string): void {
    if (!SPLogger.warningLogsEnabled) return;
    // eslint-disable-next-line no-console
    console.warn(`[WARN][${tag}]: ${msg}`);
  }
}
