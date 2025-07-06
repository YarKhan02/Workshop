import { Router } from 'express';
import { 
  login, 
  getProfile, 
  changePassword, 
  logout, 
  getStaff,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/authController';
import { authenticateToken, requireStaff, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/change-password', authenticateToken, changePassword);
router.post('/logout', authenticateToken, logout);
router.get('/staff', authenticateToken, requireStaff, getStaff);

// Admin-only user management routes
router.get('/users', authenticateToken, requireAdmin, getUsers);
router.post('/users', authenticateToken, requireAdmin, createUser);
router.put('/users/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);

export default router; 