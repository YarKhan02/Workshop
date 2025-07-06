import { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import Invoice, { InvoiceStatus, PaymentMethod } from '../models/Invoice';
import InvoiceItem from '../models/InvoiceItem';
import Customer from '../models/Customer';
import Job from '../models/Job';

// Generate unique invoice number
const generateInvoiceNumber = async (): Promise<string> => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Get count of invoices for this month
  const count = await Invoice.count({
    where: {
      createdAt: {
        [Op.gte]: new Date(year, date.getMonth(), 1),
        [Op.lt]: new Date(year, date.getMonth() + 1, 1),
      },
    },
  });
  
  return `INV-${year}${month}-${String(count + 1).padStart(4, '0')}`;
};

// Get all invoices with pagination and search
export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string;
    const customerId = req.query.customerId as string;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = { isActive: true };
    
    if (search) {
      whereClause[Op.or] = [
        { invoiceNumber: { [Op.like]: `%${search}%` } },
        { notes: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (customerId) {
      whereClause.customerId = customerId;
    }

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'jobType', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      invoices,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single invoice by ID
export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address'],
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'jobType', 'status', 'scheduledDate'],
        },
        {
          model: InvoiceItem,
          as: 'items',
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json({ invoice });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new invoice
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const invoiceData = req.body;
    const { items, ...invoiceFields } = invoiceData;

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Create invoice
    const invoice = await Invoice.create({
      ...invoiceFields,
      invoiceNumber,
      isActive: true,
    }, { transaction });

    // Create invoice items
    if (items && items.length > 0) {
      const invoiceItems = items.map((item: any) => ({
        ...item,
        invoiceId: invoice.id,
        totalPrice: item.quantity * item.unitPrice,
        isActive: true,
      }));

      await InvoiceItem.bulkCreate(invoiceItems, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update invoice
export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const updateData = req.body;
    const { items, ...invoiceFields } = updateData;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      await transaction.rollback();
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    // Update invoice
    await invoice.update(invoiceFields, { transaction });

    // Update invoice items if provided
    if (items) {
      // Deactivate existing items
      await InvoiceItem.update(
        { isActive: false },
        { where: { invoiceId: id }, transaction }
      );

      // Create new items
      if (items.length > 0) {
        const invoiceItems = items.map((item: any) => ({
          ...item,
          invoiceId: id,
          totalPrice: item.quantity * item.unitPrice,
          isActive: true,
        }));

        await InvoiceItem.bulkCreate(invoiceItems, { transaction });
      }
    }

    await transaction.commit();

    res.json({
      message: 'Invoice updated successfully',
      invoice,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete invoice (soft delete)
export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    // Soft delete invoice
    await invoice.update({ isActive: false });

    // Soft delete invoice items
    await InvoiceItem.update(
      { isActive: false },
      { where: { invoiceId: id } }
    );

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update invoice status
export const updateInvoiceStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, paymentMethod } = req.body;

    const invoice = await Invoice.findByPk(id);

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    const updateData: any = { status };
    
    if (status === InvoiceStatus.PAID) {
      updateData.paidDate = new Date();
      updateData.paymentMethod = paymentMethod;
    }

    await invoice.update(updateData);

    res.json({
      message: 'Invoice status updated successfully',
      invoice,
    });
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get billing statistics
export const getBillingStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Total invoices
    const totalInvoices = await Invoice.count({ where: { isActive: true } });
    
    // Paid invoices
    const paidInvoices = await Invoice.count({ 
      where: { 
        isActive: true, 
        status: InvoiceStatus.PAID 
      } 
    });

    // Pending invoices
    const pendingInvoices = await Invoice.count({ 
      where: { 
        isActive: true, 
        status: InvoiceStatus.PENDING 
      } 
    });

    // Overdue invoices
    const overdueInvoices = await Invoice.count({ 
      where: { 
        isActive: true, 
        status: InvoiceStatus.OVERDUE 
      } 
    });

    // Total revenue
    const totalRevenue = await Invoice.sum('totalAmount', {
      where: { 
        isActive: true, 
        status: InvoiceStatus.PAID 
      }
    });

    // Monthly revenue
    const monthlyRevenue = await Invoice.sum('totalAmount', {
      where: { 
        isActive: true, 
        status: InvoiceStatus.PAID,
        paidDate: {
          [Op.gte]: startOfMonth
        }
      }
    });

    // Yearly revenue
    const yearlyRevenue = await Invoice.sum('totalAmount', {
      where: { 
        isActive: true, 
        status: InvoiceStatus.PAID,
        paidDate: {
          [Op.gte]: startOfYear
        }
      }
    });

    // Outstanding amount
    const outstandingAmount = await Invoice.sum('totalAmount', {
      where: { 
        isActive: true, 
        status: [InvoiceStatus.PENDING, InvoiceStatus.OVERDUE]
      }
    });

    res.json({
      stats: {
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        totalRevenue: totalRevenue || 0,
        monthlyRevenue: monthlyRevenue || 0,
        yearlyRevenue: yearlyRevenue || 0,
        outstandingAmount: outstandingAmount || 0,
      },
    });
  } catch (error) {
    console.error('Get billing stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate invoice from job
export const generateInvoiceFromJob = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { jobId } = req.params;
    const { customerId, dueDate, notes, terms } = req.body;

    // Get job details
    const job = await Job.findByPk(jobId);
    if (!job) {
      await transaction.rollback();
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Create invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      customerId,
      jobId: parseInt(jobId),
      subtotal: job.totalPrice,
      taxAmount: 0, // Calculate based on business logic
      discountAmount: job.discount || 0,
      totalAmount: job.totalPrice,
      status: InvoiceStatus.PENDING,
      dueDate: new Date(dueDate),
      notes,
      terms,
      isActive: true,
    }, { transaction });

    // Create invoice item from job
    await InvoiceItem.create({
      invoiceId: invoice.id,
      description: `${job.jobType.replace('_', ' ')} - ${job.services?.join(', ') || 'Car Detailing Service'}`,
      quantity: 1,
      unitPrice: job.totalPrice,
      totalPrice: job.totalPrice,
      isActive: true,
    }, { transaction });

    await transaction.commit();

    res.status(201).json({
      message: 'Invoice generated from job successfully',
      invoice,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Generate invoice from job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 