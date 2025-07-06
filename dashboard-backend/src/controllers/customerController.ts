import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Customer from '../models/Customer';
import Car from '../models/Car';

// Get all customers with pagination and search
export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = {};
    
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    // By default, only show active customers unless specifically requested
    if (status === 'inactive') {
      whereClause.isActive = false;
    } else if (status === 'all') {
      // Don't filter by isActive - show all customers
    } else {
      // Default: only show active customers
      whereClause.isActive = true;
    }

    const { count, rows: customers } = await Customer.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Car,
          as: 'cars',
          where: { isActive: true },
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      customers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single customer by ID
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Car,
          as: 'cars',
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json({ customer });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new customer
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customerData = req.body;

    // Check if email already exists
    const existingCustomer = await Customer.findOne({
      where: { email: customerData.email },
    });

    if (existingCustomer) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const customer = await Customer.create(customerData);

    res.status(201).json({
      message: 'Customer created successfully',
      customer,
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update customer
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Check if email is being changed and if it already exists
    if (updateData.email && updateData.email !== customer.email) {
      const existingCustomer = await Customer.findOne({
        where: { email: updateData.email },
      });

      if (existingCustomer) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }
    }

    await customer.update(updateData);

    res.json({
      message: 'Customer updated successfully',
      customer,
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete customer (soft delete)
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Soft delete by setting isActive to false
    await customer.update({ isActive: false });

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get customer statistics
export const getCustomerStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalCustomers = await Customer.count();
    const activeCustomers = await Customer.count({ where: { isActive: true } });
    const inactiveCustomers = await Customer.count({ where: { isActive: false } });

    // Get top customers by total spent
    const topCustomers = await Customer.findAll({
      where: { isActive: true },
      order: [['totalSpent', 'DESC']],
      limit: 5,
      attributes: ['id', 'firstName', 'lastName', 'totalSpent', 'lastVisit'],
    });

    // Get recent customers
    const recentCustomers = await Customer.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'],
    });

    res.json({
      stats: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
      },
      topCustomers,
      recentCustomers,
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 