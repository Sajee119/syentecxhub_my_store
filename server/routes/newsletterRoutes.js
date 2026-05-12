import { Router } from 'express';
import { getSubscribers, deleteSubscriber } from '../controllers/newsletterController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = Router();

router.get('/', protect, adminOnly, getSubscribers);
router.delete('/:id', protect, adminOnly, deleteSubscriber);

export default router;
