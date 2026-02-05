/**
 * Application Constants
 * Defines routing rules, fraud indicators, and business logic constants
 */

export const ROUTING_PRIORITIES = {
    INVESTIGATION: 1,
    MANUAL_REVIEW: 2,
    SPECIALIST_QUEUE: 3,
    FAST_TRACK: 4,
    STANDARD_PROCESSING: 5,
} as const;

export const ROUTING_ROUTES = {
    INVESTIGATION: 'Investigation',
    MANUAL_REVIEW: 'Manual Review',
    SPECIALIST_QUEUE: 'Specialist Queue',
    FAST_TRACK: 'Fast Track',
    STANDARD_PROCESSING: 'Standard Processing',
} as const;

export const FRAUD_INDICATORS = [
    'fraud',
    'fraudulent',
    'fake',
    'suspicious',
    'fabricated',
    'staged',
    'false claim',
    'questionable',
    'dishonest',
    'deceptive',
    'misleading',
    'exaggerated',
    'inconsistent story',
    'tampered',
    'altered',
] as const;

export const INJURY_CLAIM_TYPES = [
    'injury',
    'medical',
    'bodily injury',
    'personal injury',
    'health',
    'accident injury',
] as const;

export const MANDATORY_FIELDS = [
    'policyInformation.policyNumber',
    'policyInformation.policyholderName',
    'incidentInformation.incidentDate',
    'incidentInformation.incidentLocation',
    'incidentInformation.incidentDescription',
    'involvedParties.claimant',
    'mandatoryFields.claimType',
    'mandatoryFields.initialEstimate',
] as const;

export const SUPPORTED_MIME_TYPES = [
    'application/pdf',
    'text/plain',
] as const;

export const FAST_TRACK_THRESHOLD = 25000; // USD
