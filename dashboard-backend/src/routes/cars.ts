import { Router } from 'express';
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarsByCustomer,
} from '../controllers/carController';
import { authenticateToken, requireStaff } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all cars
router.get('/', requireStaff, getCars);

// Get cars by customer ID
router.get('/customer/:customerId', requireStaff, getCarsByCustomer);

// Get single car
router.get('/:id', requireStaff, getCarById);

// Create new car
router.post('/', requireStaff, createCar);

// Update car
router.put('/:id', requireStaff, updateCar);

// Delete car
router.delete('/:id', requireStaff, deleteCar);

export default router; 