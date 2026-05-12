import { Router } from 'express';
import { subscribe, getRequests, markNotified, deleteRequest } from '../controllers/backInStockController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = Router();

router.post('/', subscribe);
router.get('/', protect, adminOnly, getRequests);
router.put('/:id/notify', protect, adminOnly, markNotified);
router.delete('/:id', protect, adminOnly, deleteRequest);

export default router;
