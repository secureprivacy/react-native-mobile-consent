"use strict";

/**
 * SPLogger
 *
 * Internal logger utility for Secure Privacy SDK (React Native).
 * Logs are disabled by default and can be enabled at build time.
 */
export class SPLogger {
  /** Master switch for internal SDK logs */
  static _internalLogsEnabled = false;

  /** Log level switches */
  static errorLogsEnabled = SPLogger._internalLogsEnabled;
  static infoLogsEnabled = SPLogger._internalLogsEnabled;
  static warningLogsEnabled = SPLogger._internalLogsEnabled;

  /**
   * Debug log
   */
  static d(tag, msg) {
    if (!SPLogger._internalLogsEnabled) return;
    // eslint-disable-next-line no-console
    console.debug(`[DEBUG][${tag}]: ${msg}`);
  }

  /**
   * Debug log with error / exception
   */
  static de(tag, msg, error, stack) {
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
  static e(tag, msg, error, stack) {
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
  static i(tag, msg) {
    if (!SPLogger.infoLogsEnabled) return;
    // eslint-disable-next-line no-console
    console.info(`[INFO][${tag}]: ${msg}`);
  }

  /**
   * Warning log
   */
  static w(tag, msg) {
    if (!SPLogger.warningLogsEnabled) return;
    // eslint-disable-next-line no-console
    console.warn(`[WARN][${tag}]: ${msg}`);
  }
}
//# sourceMappingURL=SPLogger.js.map