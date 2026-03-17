/**
 * The reason for recollecting consent from the user.
 */
export const SPConsentRecollectionReason = Object.freeze({
  EXPIRED: 'expired',
  STRUCTURE_CHANGED: 'structure_changed',
} as const);

/**
 * Union type of all consent recollection reason values
 */
export type SPConsentRecollectionReason =
  typeof SPConsentRecollectionReason[keyof typeof SPConsentRecollectionReason];
