import { Router } from 'express';
import { getAllReviews, toggleApproval, adminDeleteReview } from '../controllers/adminReviewController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = Router();

router.get('/', protect, adminOnly, getAllReviews);
router.put('/:id/toggle', protect, adminOnly, toggleApproval);
router.delete('/:id', protect, adminOnly, adminDeleteReview);

export default router;
