import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import claimsRoutes from './routes/claims.routes';
import { errorHandler } from './middleware/error.middleware';
import { env } from './config/env';

/**
 * Express Application Setup
 */

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// API routes
app.use('/api/claims', claimsRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested endpoint does not exist',
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
