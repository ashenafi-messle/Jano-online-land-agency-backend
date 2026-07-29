import { Router } from 'express';
import { MessageController } from '../controllers/messages/MessageController';

const router = Router();
const messageController = new MessageController();

// Public routes
router.post('/', messageController.createMessage);

// Protected routes (require authentication) - to be implemented with auth middleware
// router.get('/', authenticate, messageController.getAllMessages);
// router.get('/:id', authenticate, messageController.getMessageById);
// router.patch('/:id/status', authenticate, messageController.updateMessageStatus);
// router.delete('/:id', authenticate, messageController.deleteMessage);

export default router;
