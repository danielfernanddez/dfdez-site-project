import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);       // GET /api/products
router.get('/:id', getProductById); // GET /api/products/:id

export default router;