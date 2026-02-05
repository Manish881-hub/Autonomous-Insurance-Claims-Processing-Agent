import fs from 'fs/promises';
import pdf from 'pdf-parse';

/**
 * Document Parser Service
 * Extracts and cleans text from PDF and TXT files
 */

export class ParserService {
    /**
     * Parse a document and extract text
     * @param filePath - Path to the file to parse
     * @param mimeType - MIME type of the file
     * @returns Cleaned text content
     */
    async parseDocument(filePath: string, mimeType: string): Promise<string> {
        let rawText: string;

        if (mimeType === 'application/pdf') {
            rawText = await this.parsePDF(filePath);
        } else if (mimeType === 'text/plain') {
            rawText = await this.parseTXT(filePath);
        } else {
            throw new Error(`Unsupported file type: ${mimeType}`);
        }

        return this.cleanText(rawText);
    }

    /**
     * Parse PDF document using pdf-parse
     */
    private async parsePDF(filePath: string): Promise<string> {
        try {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error: any) {
            throw new Error(`PDF parsing failed: ${error.message}`);
        }
    }

    /**
     * Read TXT file with UTF-8 encoding
     */
    private async parseTXT(filePath: string): Promise<string> {
        try {
            return await fs.readFile(filePath, 'utf-8');
        } catch (error: any) {
            throw new Error(`TXT file reading failed: ${error.message}`);
        }
    }

    /**
     * Clean and normalize extracted text
     * - Remove excess whitespace
     * - Normalize line breaks
     * - Remove legal disclaimers
     */
    private cleanText(text: string): string {
        let cleaned = text;

        // Normalize line breaks
        cleaned = cleaned.replace(/\r\n/g, '\n');

        // Remove excessive whitespace
        cleaned = cleaned.replace(/[ \t]+/g, ' ');
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

        // Remove common legal disclaimer patterns
        cleaned = this.removeLegalDisclaimers(cleaned);

        // Trim
        cleaned = cleaned.trim();

        return cleaned;
    }

    /**
     * Remove legal disclaimers and boilerplate text
     */
    private removeLegalDisclaimers(text: string): string {
        const disclaimerPatterns = [
            /this document is confidential.*?(?:\n|$)/gi,
            /confidential and proprietary.*?(?:\n|$)/gi,
            /all rights reserved.*?(?:\n|$)/gi,
            /for internal use only.*?(?:\n|$)/gi,
            /attorney[-\s]client privilege.*?(?:\n|$)/gi,
            /privileged and confidential.*?(?:\n|$)/gi,
        ];

        let cleaned = text;
        disclaimerPatterns.forEach(pattern => {
            cleaned = cleaned.replace(pattern, '');
        });

        return cleaned;
    }
}

export const parserService = new ParserService();
