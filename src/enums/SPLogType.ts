/**
 * Log types for the SDK
 */
export const SPLogType = Object.freeze({
  DEBUG: 'debug',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
} as const);

/**
 * Union type of all log type values
 */
export type SPLogType =
  typeof SPLogType[keyof typeof SPLogType];
