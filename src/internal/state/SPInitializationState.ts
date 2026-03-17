/**
 * Maintains SDK initialization state.
 * Internal utility to avoid global variables in the public API.
 */
export class SPInitializationState {

  private static _isInitialised = false;

  static setInitialised(value: boolean) {
    this._isInitialised = value;
  }

  static isInitialised(): boolean {
    return this._isInitialised;
  }

  static clear() {
    this._isInitialised = false;
  }
}
