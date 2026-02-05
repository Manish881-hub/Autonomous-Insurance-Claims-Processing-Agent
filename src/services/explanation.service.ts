import { ExtractedClaimData } from '../schemas/claim.schema';
import { RoutingDecision } from './routing.service';

/**
 * Explanation Generator Service
 * Creates human-readable explanations for routing decisions
 */

export class ExplanationService {
    /**
     * Generate reasoning explanation for routing decision
     * @param data - Extracted claim data
     * @param routingDecision - Routing decision with triggered rules
     * @param missingFields - List of missing fields
     * @returns Human-readable explanation
     */
    generateExplanation(
        data: ExtractedClaimData,
        routingDecision: RoutingDecision,
        missingFields: string[]
    ): string {
        const parts: string[] = [];

        // Opening statement
        parts.push(
            `This claim has been routed to **${routingDecision.route}** based on the following analysis:`
        );

        // Add triggered rules
        if (routingDecision.triggeredRules.length > 0) {
            parts.push('\n**Decision Factors:**');
            routingDecision.triggeredRules.forEach((rule, index) => {
                parts.push(`${index + 1}. ${rule}`);
            });
        }

        // Add claim summary
        parts.push('\n**Claim Summary:**');

        if (data.policyInformation.policyNumber) {
            parts.push(`- Policy Number: ${data.policyInformation.policyNumber}`);
        }

        if (data.mandatoryFields.claimType) {
            parts.push(`- Claim Type: ${data.mandatoryFields.claimType}`);
        }

        const estimatedAmount = data.assetDetails.estimatedDamage ?? data.mandatoryFields.initialEstimate;
        if (estimatedAmount !== null) {
            parts.push(`- Estimated Damage: $${estimatedAmount.toLocaleString()}`);
        }

        if (data.incidentInformation.incidentDate) {
            parts.push(`- Incident Date: ${data.incidentInformation.incidentDate}`);
        }

        if (data.incidentInformation.incidentLocation) {
            parts.push(`- Location: ${data.incidentInformation.incidentLocation}`);
        }

        // Add missing fields warning if any
        if (missingFields.length > 0) {
            parts.push('\n**⚠️ Missing Required Information:**');
            missingFields.forEach(field => {
                parts.push(`- ${this.formatFieldName(field)}`);
            });
        }

        // Add next steps based on route
        parts.push('\n**Next Steps:**');
        parts.push(this.getNextSteps(routingDecision.route));

        return parts.join('\n');
    }

    /**
     * Format field name for display
     */
    private formatFieldName(fieldPath: string): string {
        return fieldPath
            .split('.')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' > ');
    }

    /**
     * Get next steps based on routing decision
     */
    private getNextSteps(route: string): string {
        const nextStepsMap: Record<string, string> = {
            'Investigation': 'This claim will be reviewed by the fraud investigation team for further assessment.',
            'Manual Review': 'An adjuster will contact the claimant to gather missing information before processing.',
            'Specialist Queue': 'This claim will be assigned to a medical specialist for evaluation and settlement.',
            'Fast Track': 'This claim qualifies for expedited processing. Settlement decision expected within 2-3 business days.',
            'Standard Processing': 'This claim will follow the standard review process. Expected processing time: 5-7 business days.',
        };

        return nextStepsMap[route] || 'This claim will be processed according to standard procedures.';
    }
}

export const explanationService = new ExplanationService();
