import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { QueryTypes } from 'sequelize';
import sequelize from './config/database';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import carRoutes from './routes/cars';
import jobRoutes from './routes/jobs';
import bookingRoutes from './routes/bookings';
import billingRoutes from './routes/billing';
import dashboardRoutes from './routes/dashboard';
import { runSeeders } from './utils/seeder';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('src/uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Car Detailing Dashboard API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Car Detailing Dashboard API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bookings', bookingRoutes);

app.use('/api/billing', billingRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Car Detailing Dashboard API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      // Sync without alter first
      await sequelize.sync({ force: false, alter: false });
      console.log('Database synced successfully.');
      
      // Manually add missing columns if they don't exist
      try {
        // Check if scheduledTime column exists in jobs table
        const scheduledTimeExists = await sequelize.query(
          "PRAGMA table_info(jobs)",
          { type: QueryTypes.SELECT }
        );
        
        const hasScheduledTime = scheduledTimeExists.some((col: any) => col.name === 'scheduledTime');
        const hasTotalAmount = scheduledTimeExists.some((col: any) => col.name === 'totalAmount');
        
        if (!hasScheduledTime) {
          await sequelize.query('ALTER TABLE jobs ADD COLUMN scheduledTime VARCHAR DEFAULT "09:00"');
          console.log('Added scheduledTime column to jobs table');
        }
        
        if (!hasTotalAmount) {
          await sequelize.query('ALTER TABLE jobs ADD COLUMN totalAmount DECIMAL(10,2) DEFAULT 0');
          console.log('Added totalAmount column to jobs table');
        }
        
        // Update existing records to have default values
        await sequelize.query('UPDATE jobs SET totalAmount = totalPrice WHERE totalAmount IS NULL OR totalAmount = 0');
        console.log('Updated existing jobs with totalAmount values');
        
      } catch (columnError: any) {
        console.log('Column addition skipped (may already exist):', columnError.message);
      }
      
      // Run seeders
      await runSeeders();
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Dashboard API: http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();