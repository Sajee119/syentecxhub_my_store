import { Router } from 'express';
import { getDashboardStats, getRevenueData, getTopProducts, getRecentUsers } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/revenue', protect, adminOnly, getRevenueData);
router.get('/top-products', protect, adminOnly, getTopProducts);
router.get('/recent-users', protect, adminOnly, getRecentUsers);

export default router;
