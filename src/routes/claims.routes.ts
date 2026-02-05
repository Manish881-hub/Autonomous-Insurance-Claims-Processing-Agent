import { Router } from 'express';
import { claimsController } from '../controllers/claims.controller';
import { upload } from '../middleware/upload.middleware';

const router: Router = Router();

/**
 * POST /api/claims/process
 * Upload and process a FNOL document
 */
router.post(
    '/process',
    upload.single('document'),
    (req, res, next) => claimsController.processClaimDocument(req, res, next)
);

export default router;
