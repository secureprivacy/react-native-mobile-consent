import type { EventSubscription } from 'react-native';

import { SPNativeBridge } from '../bridge/SPNativeBridge';
import { SPEventRegistry } from './SPEventRegistry';

import { SPDataMessageImpl } from '../../models/SPDataMessage';
import { SPConsentEventImpl } from '../../models/SPConsentEvent';

import { SPErrorCodes } from '../../support/SPErrorCodes';
import { SPLogger } from '../../support/SPLogger';

const TAG = 'SPEventBridge';

export class SPEventBridge {

  private static subscription: EventSubscription | null = null;

  static start() {
    if (this.subscription) return;

    this.subscription = SPNativeBridge.onSPEvent((payload: string) => {

      SPLogger.d(TAG, `Native event payload: ${payload}`);

      const event = SPDataMessageImpl.fromJsonWithParser(
        payload,
        SPConsentEventImpl.fromJson,
        SPErrorCodes.consentEventDataParsingError,
      );

      if (!event?.data?.code) {
        SPLogger.w(TAG, "Received event without valid code");
        return;
      }
      const listener = SPEventRegistry.get(event.data?.code || -1);
      listener?.(event);
    });

    SPLogger.i(TAG, 'Event bridge started');
  }

  static stop() {
    this.subscription?.remove();
    this.subscription = null;

    SPLogger.i(TAG, 'Event bridge stopped');
  }
}
