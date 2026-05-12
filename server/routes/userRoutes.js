import { Router } from 'express';
import { getUsers, getUser, updateProfile, changePassword, addAddress, updateAddress, deleteAddress, deleteUser, updateUserRole, toggleBanUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = Router();

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, getUser);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.delete('/:id', protect, adminOnly, deleteUser);
router.put('/role/:id', protect, adminOnly, updateUserRole);
router.put('/ban/:id', protect, adminOnly, toggleBanUser);

export default router;
