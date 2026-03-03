import NativeModule from './NativeReactNativeMobileConsent';
import type { SPAuthKey } from './models/SPAuthKey';
import { SPAuthKeyImpl } from './models/SPAuthKey';
import type { SPMessage } from './models/SPMessage';
import { SPMessageImpl } from './models/SPMessage';
import type { SPDataMessage } from './models/SPDataMessage';
import { SPDataMessageImpl } from './models/SPDataMessage';
import { SPConsentStatus } from './enums/SPConsentStatus';
import type { SPMobilePackage } from './models/SPMobilePackage';
import { SPMobilePackageImpl } from './models/SPMobilePackage';
import type { EventSubscription } from 'react-native';
import { Platform } from 'react-native';
import { SPErrorCodes } from './support/SPErrorCodes';
import { Strings } from './support/Strings';
import type { SPConsentEvent } from './models/SPConsentEvent';
import { SPConsentEventImpl } from './models/SPConsentEvent';
import { SPLogger } from './support/SPLogger';

export { SPConsentStatus } from './enums/SPConsentStatus';
export type { SPAuthKey } from './models/SPAuthKey';
export type { SPConsentData } from './models/SPConsentData';
export type { SPConsentEvent } from './models/SPConsentEvent';
export type { SPDataMessage } from './models/SPDataMessage';
export type { SPMessage } from './models/SPMessage';
export type { SPMobilePackage } from './models/SPMobilePackage';
export { SPErrorCodes } from './support/SPErrorCodes';
export { SPLogger } from './support/SPLogger';
export type { SPSerializable } from './support/SPSerializable';


const _TAG = 'SecurePrivacyMobileConsent';
let _isInitialised: boolean = false;

let _subscription: EventSubscription | null = null;
type SPListener = (event: SPDataMessage<SPConsentEvent | null>) => void;
const _listenersByEventCode = new Map<number, SPListener>();

function _startEventBridge() {
  if (_subscription) return;

  _subscription = NativeModule.onSPEvent((payload: string) => {
    const event = SPDataMessageImpl.fromJsonWithParser<SPConsentEvent | null>(payload as string, SPConsentEventImpl.from, SPErrorCodes.consentEventDataParsingError);
    if (!event) return;
    const listener = _listenersByEventCode.get(event.data?.code || -1);
    if (listener) {
      listener(event);
    }
  });
}

function _stopEventBridge() {
  _subscription?.remove();
  _subscription = null;
}


/**
 * Secure Privacy React Native SDK
 * Public API exposed to SDK consumers.
 */
export const SecurePrivacyMobileConsent = {

  initialiseSDK: async (android?: SPAuthKey, ios?: SPAuthKey): Promise<SPMessage> => {
    const config = Platform.OS == 'android'
      ? android
      : Platform.OS == 'ios'
        ? ios
        : null;
    if (config === null) {
      return {
        code: 500,
        msg: Strings.fatalError(SPErrorCodes.authKeyIsNull),
        error: SPErrorCodes.authKeyIsNull,
      };
    }
    const res = await NativeModule.initialiseSDK(SPAuthKeyImpl.from(config!).toJsonString());
    const result = SPMessageImpl.fromJson(res, SPErrorCodes.initSDKDataParsingError);
    _isInitialised = result?.code === 200;
    if (_isInitialised) {
      _startEventBridge();
    }
    return result;
  },

  isInitialised: (): boolean => {
    return _isInitialised;
  },

  getConsentStatus: async (appId: string): Promise<SPDataMessage<SPConsentStatus | null>> => {
    const payload = JSON.stringify({ applicationId: appId });
    const res = await NativeModule.getConsentStatus(payload);
    return SPDataMessageImpl.fromJsonWithParser<SPConsentStatus | null>(res, (data: any) => {
      switch (data) {
        case SPConsentStatus.PENDING:
          return SPConsentStatus.PENDING;
        case SPConsentStatus.COLLECTED:
          return SPConsentStatus.COLLECTED;
        case SPConsentStatus.RECOLLECTION_REQUIRED:
          return SPConsentStatus.RECOLLECTION_REQUIRED;
        default:
          return null;
      }
    }, SPErrorCodes.getConsentStatusDataParsingError);
  },

  showConsentBanner: async (): Promise<SPMessage> => {
    const res = await NativeModule.showConsentBanner();
    return SPMessageImpl.fromJson(res, SPErrorCodes.showConsentBannerParsingError);
  },

  showSecondaryBanner: async (): Promise<SPMessage> => {
    const res = await NativeModule.showSecondaryBanner();
    return SPMessageImpl.fromJson(res, SPErrorCodes.showSecondaryBannerParsingError);
  },

  showPreferenceCenter: async (appId: string): Promise<SPMessage> => {
    const payload = JSON.stringify({ applicationId: appId });
    const res = await NativeModule.showPreferenceCenter(payload);
    return SPMessageImpl.fromJson(res, SPErrorCodes.showPreferenceCenterParsingError);
  },

  getPackage: async (appId: string, packageId: string): Promise<SPDataMessage<SPMobilePackage | null>> => {
    const payload = JSON.stringify({ applicationId: appId, packageId: packageId });
    const res = await NativeModule.getPackage(payload);
    return SPDataMessageImpl.fromJsonWithParser<SPMobilePackage | null>(res, SPMobilePackageImpl.from, SPErrorCodes.getPackageParsingError);
  },

  clearSession: async (): Promise<SPMessage> => {
    const res = await NativeModule.clearSession();
    _isInitialised = false;
    return SPMessageImpl.fromJson(res);
  },

  onConsentEvent: (
    appId: string,
    eventCode: number,
    listener: SPListener,
  ): Subscription => {

    const subscription: Subscription = {
      unsubscribe: () => {
        const listeners = _listenersByEventCode.get(eventCode);
        if (!listeners) return;

        _listenersByEventCode.delete(eventCode);
        NativeModule.removeConsentEventListener(
          JSON.stringify({ eventCode }),
        );

        if (_listenersByEventCode.size === 0) {
          _stopEventBridge();
        }
      },
    };

    let event = _listenersByEventCode.get(eventCode);
    if (event) {
      SPLogger.w(_TAG, `Overriding existing listener for event code ${eventCode}`);
      subscription.unsubscribe();
    }

    const payload = JSON.stringify({ applicationId: appId, eventCode: eventCode });
    _listenersByEventCode.set(eventCode, listener);
    NativeModule.addConsentEventListener(payload);

    _startEventBridge();

    return subscription;
  },
};

export interface Subscription {
  unsubscribe: () => void;
}
