import type { SPAuthKey } from './models/SPAuthKey';
import type { SPMessage } from './models/SPMessage';
import type { SPDataMessage } from './models/SPDataMessage';
import { SPConsentStatus } from './enums/SPConsentStatus';
import type { SPMobilePackage } from './models/SPMobilePackage';
import type { SPConsentEvent } from './models/SPConsentEvent';
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
type SPListener = (event: SPDataMessage<SPConsentEvent | null>) => void;
/**
 * Secure Privacy React Native SDK
 * Public API exposed to SDK consumers.
 */
export declare const SecurePrivacyMobileConsent: {
    initialiseSDK: (android?: SPAuthKey, ios?: SPAuthKey) => Promise<SPMessage>;
    isInitialised: () => boolean;
    getConsentStatus: (appId: string) => Promise<SPDataMessage<SPConsentStatus | null>>;
    showConsentBanner: () => Promise<SPMessage>;
    showSecondaryBanner: () => Promise<SPMessage>;
    showPreferenceCenter: (appId: string) => Promise<SPMessage>;
    getPackage: (appId: string, packageId: string) => Promise<SPDataMessage<SPMobilePackage | null>>;
    clearSession: () => Promise<SPMessage>;
    onConsentEvent: (appId: string, eventCode: number, listener: SPListener) => Subscription;
};
export interface Subscription {
    unsubscribe: () => void;
}
//# sourceMappingURL=index.d.ts.map