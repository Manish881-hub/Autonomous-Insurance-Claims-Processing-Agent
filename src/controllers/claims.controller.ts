import { Request, Response, NextFunction } from 'express';
import { parserService } from '../services/parser.service';
import { extractionService } from '../services/extraction.service';
import { validationService } from '../services/validation.service';
import { routingService } from '../services/routing.service';
import { explanationService } from '../services/explanation.service';
import { deleteFile } from '../utils/fileCleanup';
import { ClaimProcessingResponse } from '../schemas/response.schema';

/**
 * Claims Controller
 * Handles the main claim processing flow
 */

export class ClaimsController {
    /**
     * Process uploaded FNOL document
     * POST /api/claims/process
     */
    async processClaimDocument(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        let filePath: string | undefined;

        try {
            // 1. Validate file upload
            if (!req.file) {
                res.status(400).json({
                    error: 'No file uploaded',
                    message: 'Please upload a PDF or TXT document',
                });
                return;
            }

            filePath = req.file.path;
            const mimeType = req.file.mimetype;

            console.log(`📄 Processing document: ${req.file.originalname}`);

            // 2. Parse document to extract text
            console.log('🔍 Parsing document...');
            const rawText = await parserService.parseDocument(filePath, mimeType);
            console.log(`✅ Extracted ${rawText.length} characters of text`);

            // 3. Extract structured data using LLM
            console.log('🤖 Extracting structured data with LLM...');
            const extractedData = await extractionService.extractClaimData(rawText);
            console.log('✅ Data extraction complete');

            // 4. Validate extracted data
            console.log('✔️  Validating data...');
            const validationResult = validationService.validate(extractedData);

            if (validationResult.errors.length > 0) {
                console.warn('⚠️  Validation errors:', validationResult.errors);
            }

            if (validationResult.missingFields.length > 0) {
                console.warn('⚠️  Missing fields:', validationResult.missingFields);
            }

            // 5. Determine routing
            console.log('🔀 Determining routing...');
            const routingDecision = routingService.determineRoute(
                extractedData,
                validationResult.missingFields
            );
            console.log(`✅ Route: ${routingDecision.route}`);

            // 6. Generate explanation
            console.log('📝 Generating explanation...');
            const reasoning = explanationService.generateExplanation(
                extractedData,
                routingDecision,
                validationResult.missingFields
            );

            // 7. Build response
            const response: ClaimProcessingResponse = {
                extractedFields: extractedData,
                missingFields: validationResult.missingFields,
                recommendedRoute: routingDecision.route,
                reasoning,
                triggeredRules: routingDecision.triggeredRules,
            };

            // 8. Clean up uploaded file
            if (filePath) {
                await deleteFile(filePath);
            }

            console.log('✅ Processing complete!\n');

            // 9. Send response
            res.status(200).json(response);

        } catch (error: any) {
            // Clean up file on error
            if (filePath) {
                await deleteFile(filePath);
            }
            next(error);
        }
    }
}

export const claimsController = new ClaimsController();
