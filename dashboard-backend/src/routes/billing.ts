import { Router } from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  getBillingStats,
  generateInvoiceFromJob,
} from '../controllers/billingController';
import { authenticateToken, requireStaff } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get billing statistics
router.get('/stats', requireStaff, getBillingStats);

// Generate invoice from job
router.post('/generate-from-job/:jobId', requireStaff, generateInvoiceFromJob);

// Get all invoices
router.get('/', requireStaff, getInvoices);

// Get single invoice
router.get('/:id', requireStaff, getInvoiceById);

// Create new invoice
router.post('/', requireStaff, createInvoice);

// Update invoice
router.put('/:id', requireStaff, updateInvoice);

// Update invoice status
router.patch('/:id/status', requireStaff, updateInvoiceStatus);

// Delete invoice
router.delete('/:id', requireStaff, deleteInvoice);

export default router; 