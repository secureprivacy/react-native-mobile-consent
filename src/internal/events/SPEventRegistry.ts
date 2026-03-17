import type { SPDataMessage } from '../../models/SPDataMessage';
import type { SPConsentEvent } from '../../models/SPConsentEvent';
import { SPLogger } from '../../support/SPLogger';

export type SPListener = (event: SPDataMessage<SPConsentEvent | null>) => void;
const TAG = 'SPEventRegistry';

/**
 * Maintains mapping of eventCode -> listener.
 */
export class SPEventRegistry {

  private static listeners = new Map<number, SPListener>();

  static set(eventCode: number, listener: SPListener) {
    if (this.listeners.has(eventCode)) {
      SPLogger.w(TAG, `Listener already registered for code ${eventCode} replacing with new listener`);
    }
    this.listeners.set(eventCode, listener);
  }

  static get(eventCode: number) {
    return this.listeners.get(eventCode);
  }

  static remove(eventCode: number) {
    this.listeners.delete(eventCode);
  }

  static size() {
    return this.listeners.size;
  }
}
