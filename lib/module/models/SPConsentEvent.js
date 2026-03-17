"use strict";

import { SPConsentDataImpl } from "./SPConsentData.js";
import { SPBaseModel } from "./SPBaseModel.js";
import { SPLogger } from "../support/SPLogger.js";
import { SPConsentStatus } from "../enums/SPConsentStatus.js";

/**
 * Consent event model representing the structure of consent events received from the SPConsentEngine.
 *
 * - code: A numeric event code representing the request event registered in the SPConsentEngine.
 * - applicationId: The application ID associated with the consent event.
 * - clientId: The unique identifier for the consenting client for which the consent event is associated.
 */

const TAG = 'SPConsentEvent.ts';
export class SPConsentEventImpl extends SPBaseModel {
  constructor(event) {
    super();
    this.code = event.code;
    this.applicationId = event.applicationId;
    this.clientId = event.clientId;
    this.type = event.type;
    this.status = event.status;
    this.data = event.data.map(data => SPConsentDataImpl.from(data));
  }
  static from(event) {
    return new SPConsentEventImpl(event);
  }
  static fromJson(json) {
    try {
      if (!json) {
        throw new Error('Provided JSON is undefined');
      }

      // Accept multiple key formats as different internal SDKs/APIs return different field names
      return new SPConsentEventImpl({
        code: Number(json.code ?? 0),
        applicationId: String(json.applicationId ?? ''),
        clientId: String(json.clientId ?? ''),
        type: String(json.type ?? ''),
        status: (() => {
          switch (String(json.status ?? json['consentStatus'] ?? '').toLowerCase()) {
            case SPConsentStatus.PENDING.toLowerCase():
              return SPConsentStatus.PENDING;
            case SPConsentStatus.COLLECTED.toLowerCase():
              return SPConsentStatus.COLLECTED;
            case SPConsentStatus.RECOLLECTION_REQUIRED.toLowerCase():
              return SPConsentStatus.RECOLLECTION_REQUIRED;
            default:
              SPLogger.w(TAG, `Unknown consent status in JSON: ${json?.status}`);
              return SPConsentStatus.PENDING;
            // Default to PENDING if unknown
          }
        })(),
        data: Array.isArray(json.data) ? json.data.map(SPConsentDataImpl.fromJson).filter(Boolean) : []
      });
    } catch (e) {
      SPLogger.e(TAG, 'Failed to parse SPConsentEvent from JSON: ', json, e);
      return null;
    }
  }
  toJson() {
    return {
      'code': this.code,
      'applicationId': this.applicationId,
      'clientId': this.clientId,
      'type': this.type,
      'status': this.status,
      'data': this.data.map(d => d.toJson())
    };
  }
}
//# sourceMappingURL=SPConsentEvent.js.map