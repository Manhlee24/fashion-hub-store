import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import orderRoutes from './orderRoutes.js';
import heroRoutes from './heroRoutes.js';
import bannerRoutes from './bannerRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import contactRoutes from './contactRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/heroes', heroRoutes);
router.use('/banners', bannerRoutes);
router.use('/upload', uploadRoutes);
router.use('/contact', contactRoutes);

export default router;
