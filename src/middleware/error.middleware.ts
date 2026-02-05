import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * Error response interface
 */
interface ErrorResponse {
    error: string;
    message: string;
    details?: any;
    timestamp: string;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('❌ Error:', err);

    // Default error response
    const errorResponse: ErrorResponse = {
        error: 'Internal Server Error',
        message: err.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
    };

    // Determine status code
    let statusCode = err.statusCode || 500;

    // Handle specific error types
    if (err.name === 'ValidationError' || err.name === 'ZodError') {
        statusCode = 400;
        errorResponse.error = 'Validation Error';
        errorResponse.details = err.errors || err.issues;
    } else if (err.name === 'MulterError') {
        statusCode = 400;
        errorResponse.error = 'File Upload Error';
        if (err.code === 'LIMIT_FILE_SIZE') {
            errorResponse.message = `File size exceeds the maximum allowed size of ${env.MAX_FILE_SIZE_MB}MB`;
        }
    } else if (err.message?.includes('Unsupported file type')) {
        statusCode = 400;
        errorResponse.error = 'Invalid File Type';
    } else if (err.message?.includes('LLM extraction failed')) {
        statusCode = 500;
        errorResponse.error = 'Extraction Error';
    }

    // In development, include stack trace
    if (env.NODE_ENV === 'development') {
        errorResponse.details = {
            ...errorResponse.details,
            stack: err.stack,
        };
    }

    res.status(statusCode).json(errorResponse);
};
