import { Router } from 'express';
import { ApplicationController } from '../controllers/applications/ApplicationController';

const router = Router();
const applicationController = new ApplicationController();

// Public routes
router.post('/', applicationController.createApplication);

// Broker routes (for broker portal - will add auth middleware later)
router.get('/broker/:brokerId', applicationController.getApplicationsByBroker);
router.patch('/:id/status', applicationController.updateApplicationStatus);

// Admin routes (will add auth middleware later)
router.get('/', applicationController.getAllApplications);
router.get('/:id', applicationController.getApplicationById);
router.get('/property/:propertyId', applicationController.getApplicationsByProperty);
router.delete('/:id', applicationController.deleteApplication);

export default router;
