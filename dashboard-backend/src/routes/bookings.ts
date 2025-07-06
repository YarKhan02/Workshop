import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Job from '../models/Job';
import Customer from '../models/Customer';
import Car from '../models/Car';
import { Op } from 'sequelize';
import sequelize from '../config/database';

const router = express.Router();

// Type declaration for Job with associations
interface JobWithAssociations extends Job {
  customer?: Customer;
  car?: Car;
}

// Get all bookings with pagination and filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, date } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build where clause
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (date) {
      whereClause.scheduledDate = date;
    }

    if (search) {
      whereClause[Op.or] = [
        { '$customer.firstName$': { [Op.like]: `%${search}%` } },
        { '$customer.lastName$': { [Op.like]: `%${search}%` } },
        { '$car.make$': { [Op.like]: `%${search}%` } },
        { '$car.model$': { [Op.like]: `%${search}%` } },
        { '$car.licensePlate$': { [Op.like]: `%${search}%` } },
        { jobType: { [Op.like]: `%${search}%` } }
      ];
    }

    // Get bookings with customer and car information
    const { count, rows: bookings } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'phone', 'email']
        },
        {
          model: Car,
          as: 'car',
          attributes: ['make', 'model', 'licensePlate']
        }
      ],
      order: [['scheduledDate', 'DESC'], ['scheduledTime', 'ASC']],
      limit: parseInt(limit as string),
      offset: offset
    });

    // Format bookings for frontend
    const formattedBookings = (bookings as JobWithAssociations[]).map((booking) => ({
      id: booking.id,
      customerId: booking.customerId,
      customerName: `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim(),
      customerPhone: booking.customer?.phone || '',
      customerEmail: booking.customer?.email || '',
      carId: booking.carId,
      carMake: booking.car?.make || '',
      carModel: booking.car?.model || '',
      carLicensePlate: booking.car?.licensePlate || '',
      serviceType: booking.jobType,
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      estimatedDuration: booking.estimatedDuration || 60,
      status: booking.status,
      notes: booking.notes || '',
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt
    }));

    const totalPages = Math.ceil(count / parseInt(limit as string));

    return res.json({
      bookings: formattedBookings,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total bookings
    const totalBookings = await Job.count();

    // Today's bookings
    const todayBookings = await Job.count({
      where: {
        scheduledDate: {
          [Op.gte]: today.toISOString().split('T')[0],
          [Op.lt]: tomorrow.toISOString().split('T')[0]
        }
      }
    });

    // Status counts
    const statusCounts = await Job.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const stats = {
      totalBookings,
      todayBookings,
      completedBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      inProgressBookings: 0,
      cancelledBookings: 0
    };

    // Map status counts
    statusCounts.forEach((item: any) => {
      const status = item.status;
      const count = parseInt(item.dataValues.count);
      
      switch (status) {
        case 'completed':
          stats.completedBookings = count;
          break;
        case 'pending':
          stats.pendingBookings = count;
          break;
        case 'confirmed':
          stats.confirmedBookings = count;
          break;
        case 'in_progress':
          stats.inProgressBookings = count;
          break;
        case 'cancelled':
          stats.cancelledBookings = count;
          break;
      }
    });

    return res.json({ stats });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    return res.status(500).json({ error: 'Failed to fetch booking statistics' });
  }
});

// Get single booking
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Job.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName', 'phone', 'email']
        },
        {
          model: Car,
          as: 'car',
          attributes: ['make', 'model', 'licensePlate', 'color', 'year']
        }
      ]
    }) as JobWithAssociations | null;

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Format booking
    const formattedBooking = {
      id: booking.id,
      customerId: booking.customerId,
      customerName: `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim(),
      customerPhone: booking.customer?.phone || '',
      customerEmail: booking.customer?.email || '',
      carId: booking.carId,
      carMake: booking.car?.make || '',
      carModel: booking.car?.model || '',
      carLicensePlate: booking.car?.licensePlate || '',
      carColor: booking.car?.color || '',
      carYear: booking.car?.year || '',
      serviceType: booking.jobType,
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      estimatedDuration: booking.estimatedDuration || 60,
      status: booking.status,
      notes: booking.notes || '',
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };

    return res.json({ booking: formattedBooking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      customerId,
      carId,
      jobType,
      scheduledDate,
      scheduledTime,
      estimatedDuration,
      notes,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!customerId || !carId || !jobType || !scheduledDate || !scheduledTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Check if car exists
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Create booking (job)
    const booking = await Job.create({
      customerId,
      carId,
      jobType,
      scheduledDate,
      scheduledTime,
      estimatedDuration: estimatedDuration || 60,
      status: 'pending',
      notes: notes || '',
      totalAmount: totalAmount || 0,
      totalPrice: totalAmount || 0,
      price: totalAmount || 0,
      priority: 'medium',
      services: [jobType],
      materials: [],
      isActive: true
    });

    return res.status(201).json({ 
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        customerId: booking.customerId,
        carId: booking.carId,
        jobType: booking.jobType,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const booking = await Job.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update booking
    await booking.update(updateData);

    return res.json({ 
      message: 'Booking updated successfully',
      booking: {
        id: booking.id,
        status: booking.status,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime
      }
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Delete booking
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Job.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.destroy();

    return res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router; 