import { z } from 'zod';

/**
 * Policy Information Schema
 */
export const PolicyInformationSchema = z.object({
    policyNumber: z.string().nullable(),
    policyholderName: z.string().nullable(),
    effectiveDates: z.object({
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
    }).nullable(),
});

/**
 * Incident Information Schema
 */
export const IncidentInformationSchema = z.object({
    incidentDate: z.string().nullable(),
    incidentTime: z.string().nullable(),
    incidentLocation: z.string().nullable(),
    incidentDescription: z.string().nullable(),
});

/**
 * Involved Parties Schema
 */
export const InvolvedPartiesSchema = z.object({
    claimant: z.object({
        name: z.string().nullable(),
        contactDetails: z.object({
            phone: z.string().nullable(),
            email: z.string().nullable(),
            address: z.string().nullable(),
        }).nullable(),
    }).nullable(),
    thirdParties: z.array(z.object({
        name: z.string().nullable(),
        role: z.string().nullable(),
        contactDetails: z.object({
            phone: z.string().nullable(),
            email: z.string().nullable(),
        }).nullable(),
    })).nullable(),
});

/**
 * Asset Details Schema
 */
export const AssetDetailsSchema = z.object({
    assetType: z.string().nullable(),
    assetId: z.string().nullable(),
    estimatedDamage: z.number().nullable(),
});

/**
 * Mandatory Fields Schema
 */
export const MandatoryFieldsSchema = z.object({
    claimType: z.string().nullable(),
    attachments: z.array(z.string()).nullable(),
    initialEstimate: z.number().nullable(),
});

/**
 * Complete Extracted Claim Data Schema
 */
export const ExtractedClaimDataSchema = z.object({
    policyInformation: PolicyInformationSchema,
    incidentInformation: IncidentInformationSchema,
    involvedParties: InvolvedPartiesSchema,
    assetDetails: AssetDetailsSchema,
    mandatoryFields: MandatoryFieldsSchema,
});

/**
 * Type exports
 */
export type PolicyInformation = z.infer<typeof PolicyInformationSchema>;
export type IncidentInformation = z.infer<typeof IncidentInformationSchema>;
export type InvolvedParties = z.infer<typeof InvolvedPartiesSchema>;
export type AssetDetails = z.infer<typeof AssetDetailsSchema>;
export type MandatoryFields = z.infer<typeof MandatoryFieldsSchema>;
export type ExtractedClaimData = z.infer<typeof ExtractedClaimDataSchema>;
