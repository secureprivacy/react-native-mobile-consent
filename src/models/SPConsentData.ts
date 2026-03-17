import type { SPMobilePackage } from './SPMobilePackage';
import { SPMobilePackageImpl } from './SPMobilePackage';
import { SPBaseModel } from './SPBaseModel';
import { SPLogger } from '../support/SPLogger';

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

const TAG = 'SPConsentData.ts';

export class SPConsentDataImpl extends SPBaseModel {
  consentGiven: string;
  category: string;
  subConsents: SPMobilePackageImpl[];

  private constructor(data: SPConsentData) {
    super();
    this.consentGiven = data.consentGiven;
    this.category = data.category;
    this.subConsents = data.subConsents.map((pkg) => SPMobilePackageImpl.from(pkg));
  }

  static from(data: SPConsentData): SPConsentDataImpl {
    return new SPConsentDataImpl(data);
  }

  static fromJson(json?: any): SPConsentDataImpl | null {
    try {
      if (!json) {
        throw new Error('Provided JSON is undefined');
      }

      // Accept multiple key formats as different internal SDKs/APIs return different field names
      const subConsents = json.subConsents ?? json['SubConsents'] ?? json['MobilePackageConsents'];

      return new SPConsentDataImpl({
          consentGiven: String(json.consentGiven ?? json['ConsentGiven'] ?? ''),
          category: String(json.category ?? json['Category'] ?? ''),
        subConsents: Array.isArray(subConsents)
          ? subConsents
            .map(SPMobilePackageImpl.fromJson)
            .filter(Boolean) as SPMobilePackageImpl[]
          : [],
        },
      );
    } catch (e) {
      SPLogger.e(TAG, 'Failed to parse SPConsentData from JSON: ', json, e);
      return null;
    }
  }

  toJson(): Record<string, any> {
    return {
      consentGiven: this.consentGiven,
      category: this.category,
      subConsents: this.subConsents.map(c => c.toJson()),
    };
  }
}
