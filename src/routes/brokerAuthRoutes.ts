import { Router } from 'express';
import { BrokerAuthController } from '../controllers/brokers/BrokerAuthController';

const router = Router();
const brokerAuthController = new BrokerAuthController();

// Public routes
router.post('/register', brokerAuthController.registerBroker);
router.post('/login', brokerAuthController.loginBroker);

// Protected routes (require authentication) - to be implemented with auth middleware
router.get('/:id', brokerAuthController.getBrokerProfile);
router.patch('/:id', brokerAuthController.updateBrokerProfile);

export default router;
