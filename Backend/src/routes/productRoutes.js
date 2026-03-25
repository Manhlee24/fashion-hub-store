import express from 'express';
import * as productController from '../controllers/productController.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticateToken, isAdmin, productController.createProduct);
router.put('/:id', authenticateToken, isAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, isAdmin, productController.deleteProduct);

export default router;
