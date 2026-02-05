import OpenAI from 'openai';
import { env } from '../config/env';
import { ExtractedClaimData, ExtractedClaimDataSchema } from '../schemas/claim.schema';
import { z } from 'zod';

/**
 * LLM Extraction Service
 * Uses OpenAI GPT-4 to extract structured data from FNOL documents
 */

export class ExtractionService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: env.OPENROUTER_API_KEY || 'sk-or-v1-dummy-key-for-testing',
      baseURL: env.OPENROUTER_BASE_URL,
      defaultHeaders: {
        'HTTP-Referer': 'https://github.com/Manish881-hub/Autonomous-Insurance-Claims-Processing-Agent',
        'X-Title': 'Insurance Claims Processing Agent',
      },
    });
  }

  /**
   * Extract structured claim data from raw text
   * @param rawText - Cleaned text from document parser
   * @returns Structured claim data
   */
  async extractClaimData(rawText: string): Promise<ExtractedClaimData> {
    const prompt = this.buildExtractionPrompt(rawText);

    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < env.LLM_MAX_RETRIES) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: env.LLM_MODEL,
          temperature: env.LLM_TEMPERATURE,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const responseText = completion.choices[0]?.message?.content;
        if (!responseText) {
          throw new Error('Empty response from LLM');
        }

        // Strip markdown code fences if present (some models wrap JSON)
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith('```')) {
          // Remove opening fence (```json or just ```)
          cleanedResponse = cleanedResponse.replace(/^```(?:json|JSON)?\s*/, '');
          // Remove closing fence
          cleanedResponse = cleanedResponse.replace(/\s*```$/, '');
          cleanedResponse = cleanedResponse.trim();
        }

        // Parse and validate JSON
        const parsedData = JSON.parse(cleanedResponse);
        const validatedData = ExtractedClaimDataSchema.parse(parsedData);

        return validatedData;

      } catch (error: any) {
        attempts++;
        lastError = error;
        console.error(`⚠️  Extraction attempt ${attempts} failed:`, error.message);

        // Log detailed error info from OpenRouter
        if (error.response) {
          console.error('OpenRouter Response Error:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          });
        }

        if (error.error) {
          console.error('OpenRouter API Error:', error.error);
        }

        if (attempts >= env.LLM_MAX_RETRIES) {
          break;
        }

        // Wait before retry (exponential backoff)
        await this.sleep(1000 * attempts);
      }
    }

    throw new Error(
      `LLM extraction failed after ${env.LLM_MAX_RETRIES} attempts: ${lastError?.message}`
    );
  }

  /**
   * Get system prompt for LLM
   */
  private getSystemPrompt(): string {
    return `You are an expert insurance claims data extraction system. Your task is to extract structured information from First Notice of Loss (FNOL) insurance documents.

CRITICAL RULES:
1. Output ONLY valid JSON - no additional text, explanations, or markdown
2. NEVER hallucinate or infer missing values
3. Return null for any field that is not explicitly stated in the document
4. Normalize currency values to numbers only (remove $, commas)
5. Normalize dates to ISO 8601 format (YYYY-MM-DD)
6. Ignore legal disclaimer sections
7. Be precise - only extract what is clearly stated

You must follow the exact schema structure provided in the user prompt.`;
  }

  /**
   * Build extraction prompt with schema and example
   */
  private buildExtractionPrompt(rawText: string): string {
    return `Extract structured claim data from the following FNOL document.

OUTPUT SCHEMA (you must follow this exactly):
{
  "policyInformation": {
    "policyNumber": string | null,
    "policyholderName": string | null,
    "effectiveDates": {
      "startDate": string (ISO 8601) | null,
      "endDate": string (ISO 8601) | null
    } | null
  },
  "incidentInformation": {
    "incidentDate": string (ISO 8601) | null,
    "incidentTime": string | null,
    "incidentLocation": string | null,
    "incidentDescription": string | null
  },
  "involvedParties": {
    "claimant": {
      "name": string | null,
      "contactDetails": {
        "phone": string | null,
        "email": string | null,
        "address": string | null
      } | null
    } | null,
    "thirdParties": array of {
      "name": string | null,
      "role": string | null,
      "contactDetails": {
        "phone": string | null,
        "email": string | null
      } | null
    } | null
  },
  "assetDetails": {
    "assetType": string | null,
    "assetId": string | null,
    "estimatedDamage": number | null
  },
  "mandatoryFields": {
    "claimType": string | null,
    "attachments": array of strings | null,
    "initialEstimate": number | null
  }
}

DOCUMENT TEXT:
${rawText}

Extract the data and return ONLY the JSON object. Do not include any other text.`;
  }

  /**
   * Sleep utility for retry backoff
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const extractionService = new ExtractionService();
