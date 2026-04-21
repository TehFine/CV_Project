import express from 'express';
import { login, register, getProfile, changePassword, logout } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getProfile);
router.patch('/me', protect, (req, res) => res.status(200).json({ message: 'Update profile mock' })); // Mock
router.post('/change-password', protect, changePassword);
router.post('/logout', protect, logout);

export default router;
