import app from './app';
import { env } from './config/env';

/**
 * Start the Express server
 */

const startServer = () => {
    try {
        const server = app.listen(env.PORT, () => {
            console.log('');
            console.log('🚀 ============================================');
            console.log('   Autonomous Insurance Claims Processing API');
            console.log('   ============================================');
            console.log('');
            console.log(`   Environment: ${env.NODE_ENV}`);
            console.log(`   Port:        ${env.PORT}`);
            console.log(`   LLM Model:   ${env.LLM_MODEL}`);
            console.log('');
            console.log('   Endpoints:');
            console.log(`   - POST http://localhost:${env.PORT}/api/claims/process`);
            console.log(`   - GET  http://localhost:${env.PORT}/health`);
            console.log('');
            console.log('🚀 Server is ready to process claims!');
            console.log('============================================\n');
        });

        // Graceful shutdown
        const gracefulShutdown = () => {
            console.log('\n⚠️  Shutting down gracefully...');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('❌ Forced shutdown');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
