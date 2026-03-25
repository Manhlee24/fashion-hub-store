import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, isAdmin, orderController.getOrders);
router.get('/user', authenticateToken, orderController.getUserOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);
router.post('/', authenticateToken, orderController.createOrder);
router.put('/:id/status', authenticateToken, isAdmin, orderController.updateOrderStatus);

export default router;
