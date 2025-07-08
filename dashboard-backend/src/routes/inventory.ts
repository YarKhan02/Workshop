import { Router } from 'express';
import {
  getInventories,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} from '../controllers/inventoryController';
import { authenticateToken, requireStaff } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all inventories
router.get('/', requireStaff, getInventories);

// Get single inventory
router.get('/:id', requireStaff, getInventoryById);

// Create new inventory
router.post('/', requireStaff, createInventory);

// Update inventory
router.put('/:id', requireStaff, updateInventory);

// Delete inventory
router.delete('/:id', requireStaff, deleteInventory);

export default router; 