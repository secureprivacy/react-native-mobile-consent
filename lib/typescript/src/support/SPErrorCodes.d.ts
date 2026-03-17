/**
 * Secure Privacy error codes.
 * These codes are returned from native layer or JS validation.
 */
export declare const SPErrorCodes: Readonly<{
    readonly jsonParsingError: "RN0999";
    readonly getBuildVersionDataParsingError: "RN1000";
    readonly initSDKDataParsingError: "R1001";
    readonly getConsentStatusDataParsingError: "RN1002";
    readonly showConsentBannerParsingError: "RN1003";
    readonly showSecondaryBannerParsingError: "RN1004";
    readonly showPreferenceCenterParsingError: "RN1005";
    readonly getClientIdParsingError: "RN1006";
    readonly getLocaleParsingError: "RN1007";
    readonly getCollectedConsentInfoParsingError: "RN1008";
    readonly getPackageParsingError: "RN1009";
    readonly clearSession: "RN1010";
    readonly consentEventError: "RN1011";
    readonly authKeyIsNull: "RN1012";
    readonly consentEventDataParsingError: "RN1013";
    readonly getLastConsentedAtParsingError: "RN1014";
    readonly getConsentRecollectionReasonParsingError: "RN1015";
}>;
/**
 * Type representing all possible Secure Privacy error codes.
 */
export type SPErrorCode = typeof SPErrorCodes[keyof typeof SPErrorCodes];
//# sourceMappingURL=SPErrorCodes.d.ts.map