import { z } from 'zod';
import { ExtractedClaimDataSchema } from './claim.schema';

/**
 * API Response Schema
 */
export const ClaimProcessingResponseSchema = z.object({
    extractedFields: ExtractedClaimDataSchema,
    missingFields: z.array(z.string()),
    recommendedRoute: z.string(),
    reasoning: z.string(),
    triggeredRules: z.array(z.string()),
});

export type ClaimProcessingResponse = z.infer<typeof ClaimProcessingResponseSchema>;
