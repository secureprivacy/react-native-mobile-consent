import { Platform } from 'react-native';

import type { SPAuthKey } from './models/SPAuthKey';
import { SPAuthKeyImpl } from './models/SPAuthKey';
import type { SPMessage } from './models/SPMessage';
import { SPMessageImpl } from './models/SPMessage';
import type { SPDataMessage } from './models/SPDataMessage';
import { SPDataMessageImpl } from './models/SPDataMessage';
import type { SPConsentEvent } from './models/SPConsentEvent';
import type { SPMobilePackage } from './models/SPMobilePackage';
import { SPMobilePackageImpl } from './models/SPMobilePackage';

import { SPConsentStatus } from './enums/SPConsentStatus';

import { Strings } from './support/Strings';
import { SPErrorCodes } from './support/SPErrorCodes';

import { SPInitializationState } from './internal/state/SPInitializationState';
import { SPNativeBridge } from './internal/bridge/SPNativeBridge';
import { SPEventBridge } from './internal/events/SPEventBridge';
import { SPEventRegistry } from './internal/events/SPEventRegistry';
import { SPPayloadBuilder } from './internal/utils/SPPayloadBuilder';
import { SPLogger, SPLoggerImpl } from './support/SPLogger';
import type { SPLogConfig } from './models/SPLogConfig';
import { SPLogConfigImpl } from './models/SPLogConfig';
import { SPConsentRecollectionReason } from './enums/SPConsentRecollectionReason';
import { SPConfig } from './support/SPConfig';

export interface Subscription {
  unsubscribe: () => void;
}

type SPListener = (event: SPDataMessage<SPConsentEvent | null>) => void;

const TAG = 'SecurePrivacyMobileConsent';

/**
 * Secure Privacy React Native SDK
 */
export const SecurePrivacyMobileConsent = {

  getSDKVersion: (): string => {
    return SPConfig.SDK_VERSION;
  },

  setLogConfig: async (config: SPLogConfig | SPLogConfig[]): Promise<SPMessage> => {
    const configs = Array.isArray(config) ? config : [config];

    const json = SPPayloadBuilder.withLogConfigs(configs.map(cfg => SPLogConfigImpl.from(cfg).toJson()));
    SPLogger.setLogConfig(configs);
    const res = await SPNativeBridge.setLogConfigs(json);

    return SPMessageImpl.fromJson(res);
  },

  getLocale: async (appId: string): Promise<SPDataMessage<string | null>> => {
    const res = await SPNativeBridge.getLocale(
      SPPayloadBuilder.withApplicationId(appId),
    );

    return SPDataMessageImpl.fromJsonWithParser(res, (data: any) => {
        if (typeof data === 'string') {
          return data;
        } else {
          return null;
        }
      },
      SPErrorCodes.getLocaleParsingError,
    );
  },

  initialiseSDK: async (
    android?: SPAuthKey,
    ios?: SPAuthKey,
  ): Promise<SPMessage> => {
    try {
      await SecurePrivacyMobileConsent.clearSession();
    } catch (error) {
      (SPLogger as SPLoggerImpl).internalD(TAG, 'initialiseSDK=>clearSession()', null, error);
    }
    const config = Platform.OS === 'android' ? android : Platform.OS === 'ios' ? ios : null;

    if (!config) {
      SPLogger.e(TAG, 'Auth key is null for the current platform');
      return {
        code: 500,
        msg: Strings.fatalError(SPErrorCodes.authKeyIsNull),
        error: SPErrorCodes.authKeyIsNull,
      };
    }

    const res = await SPNativeBridge.initialiseSDK(
      SPAuthKeyImpl.from(config).toJsonString(),
    );

    const result = SPMessageImpl.fromJson(
      res,
      SPErrorCodes.initSDKDataParsingError,
    );

    const isInit = result?.code === 200;

    SPLogger.i(TAG, `SDK initialization ${isInit ? 'succeeded' : 'failed'}`);

    SPInitializationState.setInitialised(isInit);

    if (isInit) {
      SPLogger.d(TAG, 'Starting event bridge...');
      SPEventBridge.start();
    }

    return result;
  },

  isInitialised: (): boolean => {
    return SPInitializationState.isInitialised();
  },

  getClientId: async (appId: string): Promise<SPDataMessage<string | null>> => {
    const res = await SPNativeBridge.getClientId(
      SPPayloadBuilder.withApplicationId(appId),
    );

    return SPDataMessageImpl.fromJsonWithParser(res, (data: any) => {
        if (typeof data === 'string') {
          return data;
        } else {
          return null;
        }
      },
      SPErrorCodes.getClientIdParsingError,
    );
  },

  getConsentStatus: async (
    appId: string,
  ): Promise<SPDataMessage<SPConsentStatus | null>> => {

    const res = await SPNativeBridge.getConsentStatus(
      SPPayloadBuilder.withApplicationId(appId),
    );

    return SPDataMessageImpl.fromJsonWithParser(res, (data: any) => {
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
      },
      SPErrorCodes.getConsentStatusDataParsingError,
    );
  },

  getLastConsentedAt: async (appId: string): Promise<SPDataMessage<bigint | null>> => {
    const res = await SPNativeBridge.getLastConsentedAt(
      SPPayloadBuilder.withApplicationId(appId),
    );
    return SPDataMessageImpl.fromJsonWithParser(res, (data: any) => {
        try {
          return BigInt(data);
        } catch {
          return null;
        }
      },
      SPErrorCodes.getLastConsentedAtParsingError,
    );
  },

  getConsentRecollectionReason: async (appId: string): Promise<SPDataMessage<SPConsentRecollectionReason | null>> => {
    const res = await SPNativeBridge.getConsentRecollectionReason(
      SPPayloadBuilder.withApplicationId(appId),
    );

    return SPDataMessageImpl.fromJsonWithParser(res, (data: any) => {
        switch (data) {
          case SPConsentRecollectionReason.EXPIRED:
            return SPConsentRecollectionReason.EXPIRED;

          case SPConsentRecollectionReason.STRUCTURE_CHANGED:
            return SPConsentRecollectionReason.STRUCTURE_CHANGED;
          default:
            return null;
        }
      },
      SPErrorCodes.getConsentRecollectionReasonParsingError,
    );
  },

  showConsentBanner: async (): Promise<SPMessage> => {
    const res = await SPNativeBridge.showConsentBanner();

    return SPMessageImpl.fromJson(
      res,
      SPErrorCodes.showConsentBannerParsingError,
    );
  },

  showSecondaryBanner: async (): Promise<SPMessage> => {
    const res = await SPNativeBridge.showSecondaryBanner();

    return SPMessageImpl.fromJson(
      res,
      SPErrorCodes.showSecondaryBannerParsingError,
    );
  },

  showPreferenceCenter: async (
    appId: string,
  ): Promise<SPMessage> => {
    const res = await SPNativeBridge.showPreferenceCenter(
      SPPayloadBuilder.withApplicationId(appId),
    );

    return SPMessageImpl.fromJson(
      res,
      SPErrorCodes.showPreferenceCenterParsingError,
    );
  },

  getPackage: async (
    appId: string,
    packageId: string,
  ): Promise<SPDataMessage<SPMobilePackage | null>> => {
    const res = await SPNativeBridge.getPackage(
      SPPayloadBuilder.withPackage(appId, packageId),
    );

    return SPDataMessageImpl.fromJsonWithParser(
      res,
      SPMobilePackageImpl.fromJson,
      SPErrorCodes.getPackageParsingError,
    );
  },

  clearSession: async (): Promise<SPMessage> => {
    const res = await SPNativeBridge.clearSession();

    SPInitializationState.clear();

    return SPMessageImpl.fromJson(res);
  },

  onConsentEvent: (
    appId: string,
    eventCode: number,
    listener: SPListener,
  ): Subscription => {

    SPEventRegistry.set(eventCode, listener);

    SPNativeBridge.addConsentEventListener(
      SPPayloadBuilder.withEvent(appId, eventCode),
    );

    SPEventBridge.start();

    return {

      unsubscribe: () => {

        SPEventRegistry.remove(eventCode);

        SPNativeBridge.removeConsentEventListener(
          JSON.stringify({ eventCode }),
        );

        if (SPEventRegistry.size() === 0) {
          SPEventBridge.stop();
        }
      },
    };
  },
};
