import express from 'express';
import * as bannerController from '../controllers/bannerController.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', bannerController.getBanners);
router.post('/', authenticateToken, isAdmin, bannerController.createBanner);
router.put('/:id', authenticateToken, isAdmin, bannerController.updateBanner);
router.delete('/:id', authenticateToken, isAdmin, bannerController.deleteBanner);

export default router;
