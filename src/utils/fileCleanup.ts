import fs from 'fs/promises';

/**
 * Safely delete a file from the filesystem
 * @param filePath - Path to the file to delete
 */
export const deleteFile = async (filePath: string): Promise<void> => {
    try {
        await fs.unlink(filePath);
        console.log(`✅ Deleted file: ${filePath}`);
    } catch (error: any) {
        console.error(`⚠️  Failed to delete file ${filePath}:`, error.message);
    }
};

/**
 * Check if a file exists
 * @param filePath - Path to check
 */
export const fileExists = async (filePath: string): Promise<boolean> => {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
};
