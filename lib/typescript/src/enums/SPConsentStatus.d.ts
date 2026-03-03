/**
 * Consent status for the SDK
 */
export declare const SPConsentStatus: Readonly<{
    readonly PENDING: "Pending";
    readonly COLLECTED: "Collected";
    readonly RECOLLECTION_REQUIRED: "RecollectionRequired";
}>;
/**
 * Union type of all consent status values
 */
export type SPConsentStatus = typeof SPConsentStatus[keyof typeof SPConsentStatus];
//# sourceMappingURL=SPConsentStatus.d.ts.map