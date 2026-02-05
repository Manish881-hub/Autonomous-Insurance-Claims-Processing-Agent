import { ExtractedClaimData } from '../schemas/claim.schema';
import { MANDATORY_FIELDS } from '../config/constants';

/**
 * Validation Service
 * Detects missing mandatory fields and validates data quality
 */

export interface ValidationResult {
    isValid: boolean;
    missingFields: string[];
    errors: string[];
}

export class ValidationService {
    /**
     * Validate extracted claim data
     * @param data - Extracted claim data from LLM
     * @returns Validation result with missing fields
     */
    validate(data: ExtractedClaimData): ValidationResult {
        const missingFields: string[] = [];
        const errors: string[] = [];

        // Check mandatory fields
        for (const fieldPath of MANDATORY_FIELDS) {
            if (!this.getNestedValue(data, fieldPath)) {
                missingFields.push(fieldPath);
            }
        }

        // Validate numeric fields
        this.validateNumericFields(data, errors);

        // Validate date fields
        this.validateDateFields(data, errors);

        return {
            isValid: missingFields.length === 0 && errors.length === 0,
            missingFields,
            errors,
        };
    }

    /**
     * Get nested value from object using dot notation path
     */
    private getNestedValue(obj: any, path: string): any {
        const parts = path.split('.');
        let current = obj;

        for (const part of parts) {
            if (current === null || current === undefined) {
                return null;
            }
            current = current[part];
        }

        return current;
    }

    /**
     * Validate numeric fields are actually numbers
     */
    private validateNumericFields(data: ExtractedClaimData, errors: string[]): void {
        // Check estimatedDamage
        if (data.assetDetails.estimatedDamage !== null) {
            if (typeof data.assetDetails.estimatedDamage !== 'number' ||
                isNaN(data.assetDetails.estimatedDamage)) {
                errors.push('assetDetails.estimatedDamage must be a valid number');
            } else if (data.assetDetails.estimatedDamage < 0) {
                errors.push('assetDetails.estimatedDamage cannot be negative');
            }
        }

        // Check initialEstimate
        if (data.mandatoryFields.initialEstimate !== null) {
            if (typeof data.mandatoryFields.initialEstimate !== 'number' ||
                isNaN(data.mandatoryFields.initialEstimate)) {
                errors.push('mandatoryFields.initialEstimate must be a valid number');
            } else if (data.mandatoryFields.initialEstimate < 0) {
                errors.push('mandatoryFields.initialEstimate cannot be negative');
            }
        }
    }

    /**
     * Validate date fields are properly formatted
     */
    private validateDateFields(data: ExtractedClaimData, errors: string[]): void {
        const dateFields = [
            { path: 'incidentInformation.incidentDate', value: data.incidentInformation.incidentDate },
            { path: 'policyInformation.effectiveDates.startDate', value: data.policyInformation.effectiveDates?.startDate },
            { path: 'policyInformation.effectiveDates.endDate', value: data.policyInformation.effectiveDates?.endDate },
        ];

        for (const field of dateFields) {
            if (field.value !== null && field.value !== undefined) {
                if (!this.isValidDate(field.value)) {
                    errors.push(`${field.path} must be a valid date`);
                }
            }
        }
    }

    /**
     * Check if a string is a valid date
     */
    private isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    }
}

export const validationService = new ValidationService();
