import { Router } from 'express';
import { getFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = Router();

router.get('/', getFAQs);
router.get('/all', protect, adminOnly, getAllFAQs);
router.post('/', protect, adminOnly, createFAQ);
router.put('/:id', protect, adminOnly, updateFAQ);
router.delete('/:id', protect, adminOnly, deleteFAQ);

export default router;
