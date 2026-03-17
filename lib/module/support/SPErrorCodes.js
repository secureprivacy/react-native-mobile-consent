"use strict";

/**
 * Secure Privacy error codes.
 * These codes are returned from native layer or JS validation.
 */
export const SPErrorCodes = Object.freeze({
  jsonParsingError: 'RN0999',
  getBuildVersionDataParsingError: 'RN1000',
  initSDKDataParsingError: 'R1001',
  getConsentStatusDataParsingError: 'RN1002',
  showConsentBannerParsingError: 'RN1003',
  showSecondaryBannerParsingError: 'RN1004',
  showPreferenceCenterParsingError: 'RN1005',
  getClientIdParsingError: 'RN1006',
  getLocaleParsingError: 'RN1007',
  getCollectedConsentInfoParsingError: 'RN1008',
  getPackageParsingError: 'RN1009',
  clearSession: 'RN1010',
  consentEventError: 'RN1011',
  authKeyIsNull: 'RN1012',
  consentEventDataParsingError: 'RN1013',
  getLastConsentedAtParsingError: 'RN1014',
  getConsentRecollectionReasonParsingError: 'RN1015'
});

/**
 * Type representing all possible Secure Privacy error codes.
 */
//# sourceMappingURL=SPErrorCodes.js.map