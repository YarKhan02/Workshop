import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Job from '../models/Job';
import Customer from '../models/Customer';
import Invoice from '../models/Invoice';
import { Op } from 'sequelize';
import sequelize from '../config/database';
import { Request, Response } from 'express';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's bookings
    const todayBookings = await Job.count({
      where: {
        scheduledDate: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });

    // Get today's revenue
    const todayRevenue = await Invoice.sum('totalAmount', {
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        },
        status: 'paid'
      }
    });

    // Get total customers
    const totalCustomers = await Customer.count({
      where: { isActive: true }
    });

    // Get total jobs
    const totalJobs = await Job.count({
      where: { isActive: true }
    });

    // Get revenue growth (simplified calculation)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthRevenue = await Invoice.sum('totalAmount', {
      where: {
        createdAt: {
          [Op.gte]: lastMonth
        },
        status: 'paid'
      }
    });

    const currentMonthRevenue = await Invoice.sum('totalAmount', {
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        },
        status: 'paid'
      }
    });

    const revenueGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Get bookings growth
    const lastMonthBookings = await Job.count({
      where: {
        createdAt: {
          [Op.gte]: lastMonth
        }
      }
    });

    const currentMonthBookings = await Job.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    const bookingsGrowth = lastMonthBookings > 0 
      ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 
      : 0;

    // Get recent jobs
    const recentJobs = await Job.findAll({
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Format recent jobs
    const formattedRecentJobs = recentJobs.map(job => ({
      id: job.id,
      customerName: `${(job as any).customer?.firstName} ${(job as any).customer?.lastName}`,
      serviceType: job.jobType,
      status: job.status,
      amount: job.totalPrice,
      createdAt: job.createdAt
    }));

    res.json({
      todayBookings,
      todayRevenue: todayRevenue || 0,
      totalCustomers,
      totalJobs,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      bookingsGrowth: Math.round(bookingsGrowth * 100) / 100,
      recentJobs: formattedRecentJobs
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get dashboard analytics for charts
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Revenue analytics
    const revenueData = await Invoice.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        },
        status: 'paid'
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // Job analytics
    const jobData = await Job.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('Job.id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    // Customer analytics
    const customerData = await Customer.findAll({
      where: {
        createdAt: {
          [Op.between]: [start, end]
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('Customer.id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      revenue: revenueData,
      jobs: jobData,
      customers: customerData
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

export default router; 