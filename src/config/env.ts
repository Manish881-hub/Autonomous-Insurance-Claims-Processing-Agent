import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3000'),
    OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
    MAX_FILE_SIZE_MB: z.string().transform(Number).default('10'),
    UPLOAD_DIR: z.string().default('./uploads'),
    LLM_MODEL: z.string().default('gpt-4'),
    LLM_TEMPERATURE: z.string().transform(Number).default('0'),
    LLM_MAX_RETRIES: z.string().transform(Number).default('3'),
});

const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Environment validation failed:');
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }
        throw error;
    }
};

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;
