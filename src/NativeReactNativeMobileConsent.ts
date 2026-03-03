import { TurboModuleRegistry, type TurboModule } from 'react-native';
import type {CodegenTypes} from 'react-native';

/**
 * Native Secure Privacy Mobile Consent TurboModule contract.
 * This mirrors Android/iOS native APIs exactly.
 */
export interface Spec extends TurboModule {

  initialiseSDK(payload: string): Promise<string>;

  getConsentStatus(payload: string): Promise<string>;

  showConsentBanner(): Promise<string>;

  showSecondaryBanner(): Promise<string>;

  showPreferenceCenter(appId: string): Promise<string>;

  getPackage(payload: string): Promise<string>;

  clearSession(): Promise<string>;

  addConsentEventListener(payload: string): void;

  removeConsentEventListener(payload: string): void;

  readonly onSPEvent: CodegenTypes.EventEmitter<string>;

}

export default TurboModuleRegistry.getEnforcing<Spec>('ReactNativeMobileConsent');
