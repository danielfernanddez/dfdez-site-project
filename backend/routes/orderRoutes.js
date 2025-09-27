import express from 'express';
import { addOrderItems, getMyOrders, getAllOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to secure these routes
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);

// This route remains public for testing or can be protected for admins
router.get('/', getAllOrders);

export default router;
