import { type TurboModule } from 'react-native';
import type { CodegenTypes } from 'react-native';
/**
 * Native Secure Privacy Mobile Consent TurboModule contract.
 * This mirrors Android/iOS native APIs exactly.
 */
export interface Spec extends TurboModule {
    setLogConfigs(payload: string): Promise<string>;
    getLocale(payload: string): Promise<string>;
    initialiseSDK(payload: string): Promise<string>;
    getClientId(payload: string): Promise<string>;
    getConsentStatus(payload: string): Promise<string>;
    getLastConsentedAt(payload: string): Promise<string>;
    getConsentRecollectionReason(payload: string): Promise<string>;
    showConsentBanner(): Promise<string>;
    showSecondaryBanner(): Promise<string>;
    showPreferenceCenter(payload: string): Promise<string>;
    getPackage(payload: string): Promise<string>;
    clearSession(): Promise<string>;
    addConsentEventListener(payload: string): void;
    removeConsentEventListener(payload: string): void;
    readonly onSPEvent: CodegenTypes.EventEmitter<string>;
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeReactNativeMobileConsent.d.ts.map