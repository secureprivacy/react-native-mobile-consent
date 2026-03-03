"use strict";

import NativeModule from "./NativeReactNativeMobileConsent.js";
import { SPAuthKeyImpl } from "./models/SPAuthKey.js";
import { SPMessageImpl } from "./models/SPMessage.js";
import { SPDataMessageImpl } from "./models/SPDataMessage.js";
import { SPConsentStatus } from "./enums/SPConsentStatus.js";
import { SPMobilePackageImpl } from "./models/SPMobilePackage.js";
import { Platform } from 'react-native';
import { SPErrorCodes } from "./support/SPErrorCodes.js";
import { Strings } from "./support/Strings.js";
import { SPConsentEventImpl } from "./models/SPConsentEvent.js";
import { SPLogger } from "./support/SPLogger.js";
export { SPConsentStatus } from "./enums/SPConsentStatus.js";
export { SPErrorCodes } from "./support/SPErrorCodes.js";
export { SPLogger } from "./support/SPLogger.js";
const _TAG = 'SecurePrivacyMobileConsent';
let _isInitialised = false;
let _subscription = null;
const _listenersByEventCode = new Map();
function _startEventBridge() {
  if (_subscription) return;
  _subscription = NativeModule.onSPEvent(payload => {
    const event = SPDataMessageImpl.fromJsonWithParser(payload, SPConsentEventImpl.from, SPErrorCodes.consentEventDataParsingError);
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
  initialiseSDK: async (android, ios) => {
    const config = Platform.OS == 'android' ? android : Platform.OS == 'ios' ? ios : null;
    if (config === null) {
      return {
        code: 500,
        msg: Strings.fatalError(SPErrorCodes.authKeyIsNull),
        error: SPErrorCodes.authKeyIsNull
      };
    }
    const res = await NativeModule.initialiseSDK(SPAuthKeyImpl.from(config).toJsonString());
    const result = SPMessageImpl.fromJson(res, SPErrorCodes.initSDKDataParsingError);
    _isInitialised = result?.code === 200;
    if (_isInitialised) {
      _startEventBridge();
    }
    return result;
  },
  isInitialised: () => {
    return _isInitialised;
  },
  getConsentStatus: async appId => {
    const payload = JSON.stringify({
      applicationId: appId
    });
    const res = await NativeModule.getConsentStatus(payload);
    return SPDataMessageImpl.fromJsonWithParser(res, data => {
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
  showConsentBanner: async () => {
    const res = await NativeModule.showConsentBanner();
    return SPMessageImpl.fromJson(res, SPErrorCodes.showConsentBannerParsingError);
  },
  showSecondaryBanner: async () => {
    const res = await NativeModule.showSecondaryBanner();
    return SPMessageImpl.fromJson(res, SPErrorCodes.showSecondaryBannerParsingError);
  },
  showPreferenceCenter: async appId => {
    const payload = JSON.stringify({
      applicationId: appId
    });
    const res = await NativeModule.showPreferenceCenter(payload);
    return SPMessageImpl.fromJson(res, SPErrorCodes.showPreferenceCenterParsingError);
  },
  getPackage: async (appId, packageId) => {
    const payload = JSON.stringify({
      applicationId: appId,
      packageId: packageId
    });
    const res = await NativeModule.getPackage(payload);
    return SPDataMessageImpl.fromJsonWithParser(res, SPMobilePackageImpl.from, SPErrorCodes.getPackageParsingError);
  },
  clearSession: async () => {
    const res = await NativeModule.clearSession();
    _isInitialised = false;
    return SPMessageImpl.fromJson(res);
  },
  onConsentEvent: (appId, eventCode, listener) => {
    const subscription = {
      unsubscribe: () => {
        const listeners = _listenersByEventCode.get(eventCode);
        if (!listeners) return;
        _listenersByEventCode.delete(eventCode);
        NativeModule.removeConsentEventListener(JSON.stringify({
          eventCode
        }));
        if (_listenersByEventCode.size === 0) {
          _stopEventBridge();
        }
      }
    };
    let event = _listenersByEventCode.get(eventCode);
    if (event) {
      SPLogger.w(_TAG, `Overriding existing listener for event code ${eventCode}`);
      subscription.unsubscribe();
    }
    const payload = JSON.stringify({
      applicationId: appId,
      eventCode: eventCode
    });
    _listenersByEventCode.set(eventCode, listener);
    NativeModule.addConsentEventListener(payload);
    _startEventBridge();
    return subscription;
  }
};
//# sourceMappingURL=index.js.map