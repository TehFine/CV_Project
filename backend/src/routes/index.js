import express from 'express';
import authRoutes from './auth.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);

// Optional: Test route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to CV_Project API' });
});

export default router;
