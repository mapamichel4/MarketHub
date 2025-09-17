import express from 'express';
import {
  sendMessage,
  getConversations,
  getMessages,
} from '../controllers/messageControllers';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversation/:otherUserId', getMessages);

export default router;