import multer from 'multer';
import path from 'path';
import { env } from '../config/env';
import { SUPPORTED_MIME_TYPES } from '../config/constants';
import fs from 'fs';

// Ensure uploads directory exists
if (!fs.existsSync(env.UPLOAD_DIR)) {
    fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

/**
 * Multer storage configuration
 */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, env.UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `claim-${uniqueSuffix}${ext}`);
    },
});

/**
 * File filter to only accept PDF and TXT
 */
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (SUPPORTED_MIME_TYPES.includes(file.mimetype as any)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type. Only PDF and TXT files are allowed. Received: ${file.mimetype}`));
    }
};

/**
 * Multer upload middleware
 */
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024, // Convert MB to bytes
    },
});
