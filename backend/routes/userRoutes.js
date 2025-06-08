import express from 'express';
import { getTestHistory } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/tests', verifyToken, getTestHistory);

export default router;
