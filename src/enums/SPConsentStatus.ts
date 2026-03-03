/**
 * Consent status for the SDK
 */
export const SPConsentStatus = Object.freeze({
  PENDING: 'Pending',
  COLLECTED: 'Collected',
  RECOLLECTION_REQUIRED: 'RecollectionRequired',
} as const);

/**
 * Union type of all consent status values
 */
export type SPConsentStatus =
  typeof SPConsentStatus[keyof typeof SPConsentStatus];
