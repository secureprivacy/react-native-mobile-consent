/**
 * SPLogger
 *
 * Internal logger utility for Secure Privacy SDK (React Native).
 * Logs are disabled by default and can be enabled at build time.
 */
export declare class SPLogger {
    /** Master switch for internal SDK logs */
    private static readonly _internalLogsEnabled;
    /** Log level switches */
    static errorLogsEnabled: boolean;
    static infoLogsEnabled: boolean;
    static warningLogsEnabled: boolean;
    /**
     * Debug log
     */
    static d(tag: string, msg: string): void;
    /**
     * Debug log with error / exception
     */
    static de(tag: string, msg: string, error?: unknown, stack?: unknown): void;
    /**
     * Error log
     */
    static e(tag: string, msg: string, error?: unknown, stack?: unknown): void;
    /**
     * Info log
     */
    static i(tag: string, msg: string): void;
    /**
     * Warning log
     */
    static w(tag: string, msg: string): void;
}
//# sourceMappingURL=SPLogger.d.ts.map