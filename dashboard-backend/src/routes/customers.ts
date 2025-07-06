import { Router } from 'express';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
} from '../controllers/customerController';
import { authenticateToken, requireStaff } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get customer statistics (admin/accountant only)
router.get('/stats', requireStaff, getCustomerStats);

// Get all customers
router.get('/', requireStaff, getCustomers);

// Get single customer
router.get('/:id', requireStaff, getCustomerById);

// Create new customer
router.post('/', requireStaff, createCustomer);

// Update customer
router.put('/:id', requireStaff, updateCustomer);

// Delete customer
router.delete('/:id', requireStaff, deleteCustomer);

export default router; 