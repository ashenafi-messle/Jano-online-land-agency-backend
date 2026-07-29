import { Router } from 'express';
import { PasswordResetController } from '../controllers/brokers/PasswordResetController';

const router = Router();
const passwordResetController = new PasswordResetController();

// Public routes
router.post('/forgot-password', passwordResetController.requestPasswordReset);
router.get('/validate-token/:token', passwordResetController.validateResetToken);
router.post('/reset-password', passwordResetController.resetPassword);

export default router;
