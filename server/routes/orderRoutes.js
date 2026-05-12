import { Router } from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus, getUserOrders, getOrderByInvoice } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/orderValidation.js';

const router = Router();

router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/', protect, getOrders);
router.get('/my-orders', protect, getUserOrders);
router.get('/invoice/:invoice', getOrderByInvoice);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, adminOnly, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
