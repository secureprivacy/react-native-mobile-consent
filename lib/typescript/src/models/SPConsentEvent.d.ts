import type { SPConsentData } from './SPConsentData';
import { SPConsentDataImpl } from './SPConsentData';
import { SPBaseModel } from './SPBaseModel';
import { SPConsentStatus } from '../enums/SPConsentStatus';
/**
 * Consent event model representing the structure of consent events received from the SPConsentEngine.
 *
 * - code: A numeric event code representing the request event registered in the SPConsentEngine.
 * - applicationId: The application ID associated with the consent event.
 * - clientId: The unique identifier for the consenting client for which the consent event is associated.
 */
export interface SPConsentEvent {
    code: number;
    applicationId: string;
    clientId: string;
    type: string;
    status: SPConsentStatus;
    data: SPConsentData[];
}
export declare class SPConsentEventImpl extends SPBaseModel {
    code: number;
    applicationId: string;
    clientId: string;
    type: string;
    status: SPConsentStatus;
    data: SPConsentDataImpl[];
    private constructor();
    static from(event: SPConsentEvent): SPConsentEventImpl;
    static fromJson(json?: any): SPConsentEventImpl | null;
    toJson(): Record<string, unknown>;
}
//# sourceMappingURL=SPConsentEvent.d.ts.map