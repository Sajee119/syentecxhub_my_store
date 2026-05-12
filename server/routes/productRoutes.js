import { Router } from 'express';
import { getProducts, getProduct, getProductById, getFeaturedProducts, getRelatedProducts, createProduct, updateProduct, deleteProduct, uploadProductImages, getLowStockProducts } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import upload from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { productSchema } from '../validations/productValidation.js';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/low-stock', protect, adminOnly, getLowStockProducts);
router.get('/:slug', getProduct);
router.get('/id/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.post('/', protect, adminOnly, upload.array('images', 10), validate(productSchema), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/upload-images', protect, adminOnly, upload.array('images', 10), uploadProductImages);

export default router;
