import NativeModule from '../../NativeReactNativeMobileConsent';

/**
 * Wrapper around React Native native module.
 */
export const SPNativeBridge = {

  setLogConfigs(payload: string) {
    return NativeModule.setLogConfigs(payload);
  },

  getLocale(payload: string) {
    return NativeModule.getLocale(payload);
  },

  initialiseSDK(payload: string) {
    return NativeModule.initialiseSDK(payload);
  },

  getClientId(payload: string) {
    return NativeModule.getClientId(payload);
  },

  getConsentStatus(payload: string) {
    return NativeModule.getConsentStatus(payload);
  },

  getLastConsentedAt(payload: string) {
    return NativeModule.getLastConsentedAt(payload);
  },

  getConsentRecollectionReason(payload: string) {
    return NativeModule.getConsentRecollectionReason(payload);
  },

  showConsentBanner() {
    return NativeModule.showConsentBanner();
  },

  showSecondaryBanner() {
    return NativeModule.showSecondaryBanner();
  },

  showPreferenceCenter(payload: string) {
    return NativeModule.showPreferenceCenter(payload);
  },

  getPackage(payload: string) {
    return NativeModule.getPackage(payload);
  },

  // getCollectedConsentInfo(payload: string) {
  //   return NativeModule.getCollectedConsentInfo(payload);
  // },

  clearSession() {
    return NativeModule.clearSession();
  },

  addConsentEventListener(payload: string) {
    return NativeModule.addConsentEventListener(payload);
  },

  removeConsentEventListener(payload: string) {
    return NativeModule.removeConsentEventListener(payload);
  },

  onSPEvent(callback: (payload: string) => void) {
    return NativeModule.onSPEvent(callback);
  },
};
