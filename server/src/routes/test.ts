// server/src/routes/test.ts
import express from 'express';
import { getProtectedData } from '../controllers/testControllers';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/protected', authenticateToken, getProtectedData);

export default router;