import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Job from '../models/Job';
import Customer from '../models/Customer';
import Car from '../models/Car';
import User from '../models/User';

// Get all jobs with pagination and search
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const jobType = req.query.jobType as string;
    const customerId = req.query.customerId as string;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = { isActive: true };
    
    if (search) {
      whereClause[Op.or] = [
        { '$customer.firstName$': { [Op.like]: `%${search}%` } },
        { '$customer.lastName$': { [Op.like]: `%${search}%` } },
        { '$car.make$': { [Op.like]: `%${search}%` } },
        { '$car.model$': { [Op.like]: `%${search}%` } },
        { '$car.licensePlate$': { [Op.like]: `%${search}%` } },
        { notes: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (jobType) {
      whereClause.jobType = jobType;
    }

    if (customerId) {
      whereClause.customerId = customerId;
    }

    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'year', 'color', 'licensePlate'],
        },
        {
          model: User,
          as: 'assignedStaff',
          attributes: ['id', 'firstName', 'lastName', 'username'],
        },
      ],
      order: [['scheduledDate', 'ASC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single job by ID
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'address'],
        },
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'year', 'color', 'licensePlate', 'vin', 'mileage'],
        },
        {
          model: User,
          as: 'assignedStaff',
          attributes: ['id', 'firstName', 'lastName', 'username'],
        },
      ],
    });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new job
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobData = req.body;

    // Verify customer exists
    const customer = await Customer.findByPk(jobData.customerId);
    if (!customer) {
      res.status(400).json({ error: 'Customer not found' });
      return;
    }

    // Verify car exists
    const car = await Car.findByPk(jobData.carId);
    if (!car) {
      res.status(400).json({ error: 'Car not found' });
      return;
    }

    // Verify assigned staff exists (if provided)
    if (jobData.assignedTo) {
      const staff = await User.findByPk(jobData.assignedTo);
      if (!staff) {
        res.status(400).json({ error: 'Assigned staff not found' });
        return;
      }
    }

    // Calculate total price
    const discount = jobData.discount || 0;
    const totalPrice = jobData.price - discount;

    const job = await Job.create({
      ...jobData,
      totalPrice,
    });

    // Fetch the created job with related information
    const createdJob = await Job.findByPk(job.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'year', 'color', 'licensePlate'],
        },
        {
          model: User,
          as: 'assignedStaff',
          attributes: ['id', 'firstName', 'lastName', 'username'],
        },
      ],
    });

    res.status(201).json({
      message: 'Job created successfully',
      job: createdJob,
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update job
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const job = await Job.findByPk(id);

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    // Verify customer exists (if being updated)
    if (updateData.customerId) {
      const customer = await Customer.findByPk(updateData.customerId);
      if (!customer) {
        res.status(400).json({ error: 'Customer not found' });
        return;
      }
    }

    // Verify car exists (if being updated)
    if (updateData.carId) {
      const car = await Car.findByPk(updateData.carId);
      if (!car) {
        res.status(400).json({ error: 'Car not found' });
        return;
      }
    }

    // Verify assigned staff exists (if being updated)
    if (updateData.assignedTo) {
      const staff = await User.findByPk(updateData.assignedTo);
      if (!staff) {
        res.status(400).json({ error: 'Assigned staff not found' });
        return;
      }
    }

    // Calculate total price if price or discount is being updated
    if (updateData.price || updateData.discount !== undefined) {
      const price = updateData.price || job.price;
      const discount = updateData.discount || job.discount || 0;
      updateData.totalPrice = price - discount;
    }

    // Handle status changes
    if (updateData.status === 'in_progress' && !job.startTime) {
      updateData.startTime = new Date();
    }

    if (updateData.status === 'completed' && !job.endTime) {
      updateData.endTime = new Date();
      if (job.startTime && !updateData.actualDuration) {
        const duration = Math.round((new Date().getTime() - job.startTime.getTime()) / (1000 * 60));
        updateData.actualDuration = duration;
      }
    }

    await job.update(updateData);

    // Fetch the updated job with related information
    const updatedJob = await Job.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'year', 'color', 'licensePlate'],
        },
        {
          model: User,
          as: 'assignedStaff',
          attributes: ['id', 'firstName', 'lastName', 'username'],
        },
      ],
    });

    res.json({
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete job (soft delete)
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    // Soft delete by setting isActive to false
    await job.update({ isActive: false });

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get jobs by customer ID
export const getJobsByCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;

    const jobs = await Job.findAll({
      where: { customerId, isActive: true },
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'year', 'color', 'licensePlate'],
        },
        {
          model: User,
          as: 'assignedStaff',
          attributes: ['id', 'firstName', 'lastName', 'username'],
        },
      ],
      order: [['scheduledDate', 'DESC']],
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Get jobs by customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get jobs by car ID
export const getJobsByCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.params;

    const jobs = await Job.findAll({
      where: { carId, isActive: true },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: User,
          as: 'assignedStaff',
          attributes: ['id', 'firstName', 'lastName', 'username'],
        },
      ],
      order: [['scheduledDate', 'DESC']],
    });

    res.json({ jobs });
  } catch (error) {
    console.error('Get jobs by car error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get jobs statistics
export const getJobStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const [
      totalJobs,
      pendingJobs,
      inProgressJobs,
      completedJobs,
      todayJobs,
      totalRevenue,
      todayRevenue,
    ] = await Promise.all([
      Job.count({ where: { isActive: true } }),
      Job.count({ where: { status: 'pending', isActive: true } }),
      Job.count({ where: { status: 'in_progress', isActive: true } }),
      Job.count({ where: { status: 'completed', isActive: true } }),
      Job.count({
        where: {
          scheduledDate: {
            [Op.between]: [startOfDay, endOfDay],
          },
          isActive: true,
        },
      }),
      Job.sum('totalPrice', { where: { status: 'completed', isActive: true } }),
      Job.sum('totalPrice', {
        where: {
          status: 'completed',
          endTime: {
            [Op.between]: [startOfDay, endOfDay],
          },
          isActive: true,
        },
      }),
    ]);

    res.json({
      stats: {
        totalJobs,
        pendingJobs,
        inProgressJobs,
        completedJobs,
        todayJobs,
        totalRevenue: totalRevenue || 0,
        todayRevenue: todayRevenue || 0,
      },
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 