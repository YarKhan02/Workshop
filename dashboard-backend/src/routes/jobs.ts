import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByCustomer,
  getJobsByCar,
  getJobStats,
} from '../controllers/jobController';
import { authenticateToken, requireStaff } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get job statistics
router.get('/stats', requireStaff, getJobStats);

// Get all jobs
router.get('/', requireStaff, getJobs);

// Get jobs by customer ID
router.get('/customer/:customerId', requireStaff, getJobsByCustomer);

// Get jobs by car ID
router.get('/car/:carId', requireStaff, getJobsByCar);

// Get single job
router.get('/:id', requireStaff, getJobById);

// Create new job
router.post('/', requireStaff, createJob);

// Update job
router.put('/:id', requireStaff, updateJob);

// Delete job
router.delete('/:id', requireStaff, deleteJob);

export default router; 