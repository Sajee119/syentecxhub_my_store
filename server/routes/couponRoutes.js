import { Router } from 'express';
import { getCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon, validateCoupon } from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { validate } from '../middleware/validate.js';
import { couponSchema } from '../validations/couponValidation.js';

const router = Router();

router.get('/', protect, adminOnly, getCoupons);
router.get('/:id', protect, adminOnly, getCoupon);
router.post('/', protect, adminOnly, validate(couponSchema), createCoupon);
router.post('/validate', protect, validateCoupon);
router.put('/:id', protect, adminOnly, updateCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

export default router;
