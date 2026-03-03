import type { SPMobilePackage } from './SPMobilePackage';
import { SPMobilePackageImpl } from './SPMobilePackage';
import { SPBaseModel } from './SPBaseModel';
/**
 * Consent data model representing user consent for a specific category and its associated mobile packages
 *
 * - `consentGiven`: Indicates whether consent was given ("true" or "false")
 * - `category`: The category of consent (e.g., "analytics", "marketing")
 * - `subConsents`: An array of mobile packages associated with this consent category
 */
export interface SPConsentData {
    consentGiven: string;
    category: string;
    subConsents: SPMobilePackage[];
}
export declare class SPConsentDataImpl extends SPBaseModel {
    consentGiven: string;
    category: string;
    subConsents: SPMobilePackageImpl[];
    private constructor();
    static from(data: SPConsentData): SPConsentDataImpl;
    static fromJson(json?: any): SPConsentDataImpl | null;
    toJson(): Record<string, any>;
}
//# sourceMappingURL=SPConsentData.d.ts.map