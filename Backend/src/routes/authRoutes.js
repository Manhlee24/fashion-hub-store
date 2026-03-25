import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticateToken, authController.getProfile);

export default router;
