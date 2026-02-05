import { ExtractedClaimData } from '../schemas/claim.schema';
import {
    ROUTING_ROUTES,
    ROUTING_PRIORITIES,
    FRAUD_INDICATORS,
    INJURY_CLAIM_TYPES,
    FAST_TRACK_THRESHOLD,
} from '../config/constants';

/**
 * Routing Decision Result
 */
export interface RoutingDecision {
    route: string;
    priority: number;
    triggeredRules: string[];
}

/**
 * Routing Service
 * Evaluates business rules and routes claims to appropriate workflows
 */

export class RoutingService {
    /**
     * Determine routing for a claim based on business rules
     * @param data - Extracted claim data
     * @param missingFields - List of missing mandatory fields
     * @returns Routing decision with triggered rules
     */
    determineRoute(data: ExtractedClaimData, missingFields: string[]): RoutingDecision {
        const triggeredRules: string[] = [];

        // Priority 1: Investigation (fraud indicators)
        if (this.hasFraudIndicators(data)) {
            triggeredRules.push('Fraud indicators detected in incident description');
            return {
                route: ROUTING_ROUTES.INVESTIGATION,
                priority: ROUTING_PRIORITIES.INVESTIGATION,
                triggeredRules,
            };
        }

        // Priority 2: Manual Review (missing mandatory fields)
        if (missingFields.length > 0) {
            triggeredRules.push(`Missing mandatory fields: ${missingFields.join(', ')}`);
            return {
                route: ROUTING_ROUTES.MANUAL_REVIEW,
                priority: ROUTING_PRIORITIES.MANUAL_REVIEW,
                triggeredRules,
            };
        }

        // Priority 3: Specialist Queue (injury claims)
        if (this.isInjuryClaim(data)) {
            triggeredRules.push('Claim type indicates injury or medical attention required');
            return {
                route: ROUTING_ROUTES.SPECIALIST_QUEUE,
                priority: ROUTING_PRIORITIES.SPECIALIST_QUEUE,
                triggeredRules,
            };
        }

        // Priority 4: Fast Track (low damage amount)
        if (this.isLowDamageClaim(data)) {
            const amount = data.assetDetails.estimatedDamage ?? data.mandatoryFields.initialEstimate ?? 0;
            triggeredRules.push(`Estimated damage ($${amount}) is below fast track threshold ($${FAST_TRACK_THRESHOLD})`);
            return {
                route: ROUTING_ROUTES.FAST_TRACK,
                priority: ROUTING_PRIORITIES.FAST_TRACK,
                triggeredRules,
            };
        }

        // Priority 5: Standard Processing (default)
        triggeredRules.push('No special conditions detected, routing to standard processing');
        return {
            route: ROUTING_ROUTES.STANDARD_PROCESSING,
            priority: ROUTING_PRIORITIES.STANDARD_PROCESSING,
            triggeredRules,
        };
    }

    /**
     * Check if incident description contains fraud indicators
     */
    private hasFraudIndicators(data: ExtractedClaimData): boolean {
        const description = data.incidentInformation.incidentDescription?.toLowerCase() || '';

        return FRAUD_INDICATORS.some(indicator =>
            description.includes(indicator.toLowerCase())
        );
    }

    /**
     * Check if claim is injury-related
     */
    private isInjuryClaim(data: ExtractedClaimData): boolean {
        const claimType = data.mandatoryFields.claimType?.toLowerCase() || '';

        return INJURY_CLAIM_TYPES.some(type =>
            claimType.includes(type.toLowerCase())
        );
    }

    /**
     * Check if claim has low damage amount (fast track eligible)
     */
    private isLowDamageClaim(data: ExtractedClaimData): boolean {
        // Use estimatedDamage first, fall back to initialEstimate
        const amount = data.assetDetails.estimatedDamage ?? data.mandatoryFields.initialEstimate;

        if (amount === null || amount === undefined) {
            return false;
        }

        return amount < FAST_TRACK_THRESHOLD;
    }
}

export const routingService = new RoutingService();
