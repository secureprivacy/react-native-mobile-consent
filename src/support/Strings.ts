/**
 * String helpers used inside Secure Privacy SDK.
 */
export const Strings = Object.freeze({
  /**
   * Returns formatted fatal error message.
   *
   * @param errorCode - Secure Privacy error code
   * @returns formatted message
   */
  fatalError(errorCode: string): string {
    return `Something went wrong! (${errorCode})`;
  },
});
