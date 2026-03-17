"use strict";

import { SPMobilePackageImpl } from "./SPMobilePackage.js";
import { SPBaseModel } from "./SPBaseModel.js";
import { SPLogger } from "../support/SPLogger.js";

/**
 * Consent data model representing user consent for a specific category and its associated mobile packages
 *
 * - `consentGiven`: Indicates whether consent was given ("true" or "false")
 * - `category`: The category of consent (e.g., "analytics", "marketing")
 * - `subConsents`: An array of mobile packages associated with this consent category
 */

const TAG = 'SPConsentData.ts';
export class SPConsentDataImpl extends SPBaseModel {
  constructor(data) {
    super();
    this.consentGiven = data.consentGiven;
    this.category = data.category;
    this.subConsents = data.subConsents.map(pkg => SPMobilePackageImpl.from(pkg));
  }
  static from(data) {
    return new SPConsentDataImpl(data);
  }
  static fromJson(json) {
    try {
      if (!json) {
        throw new Error('Provided JSON is undefined');
      }

      // Accept multiple key formats as different internal SDKs/APIs return different field names
      const subConsents = json.subConsents ?? json['SubConsents'] ?? json['MobilePackageConsents'];
      return new SPConsentDataImpl({
        consentGiven: String(json.consentGiven ?? json['ConsentGiven'] ?? ''),
        category: String(json.category ?? json['Category'] ?? ''),
        subConsents: Array.isArray(subConsents) ? subConsents.map(SPMobilePackageImpl.fromJson).filter(Boolean) : []
      });
    } catch (e) {
      SPLogger.e(TAG, 'Failed to parse SPConsentData from JSON: ', json, e);
      return null;
    }
  }
  toJson() {
    return {
      consentGiven: this.consentGiven,
      category: this.category,
      subConsents: this.subConsents.map(c => c.toJson())
    };
  }
}
//# sourceMappingURL=SPConsentData.js.map