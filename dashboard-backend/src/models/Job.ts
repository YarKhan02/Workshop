import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';
import Car from './Car';
import User from './User';

export interface JobAttributes {
  id?: number;
  customerId: number;
  carId: number;
  assignedTo?: number; // User ID of the staff member assigned
  jobType: 'basic_wash' | 'full_detail' | 'interior_detail' | 'exterior_detail' | 'premium_detail' | 'custom';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: Date;
  scheduledTime: string; // Time string in HH:MM format
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  startTime?: Date;
  endTime?: Date;
  price: number;
  discount?: number;
  totalPrice: number;
  totalAmount: number; // Alias for totalPrice for bookings compatibility
  notes?: string;
  customerNotes?: string;
  beforePhotos?: string[]; // URLs to photos
  afterPhotos?: string[]; // URLs to photos
  services: string[]; // Array of service names
  materials: string[]; // Array of materials used
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JobCreationAttributes extends Omit<JobAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: number;
  public customerId!: number;
  public carId!: number;
  public assignedTo?: number;
  public jobType!: 'basic_wash' | 'full_detail' | 'interior_detail' | 'exterior_detail' | 'premium_detail' | 'custom';
  public status!: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public scheduledDate!: Date;
  public scheduledTime!: string;
  public estimatedDuration!: number;
  public actualDuration?: number;
  public startTime?: Date;
  public endTime?: Date;
  public price!: number;
  public discount?: number;
  public totalPrice!: number;
  public totalAmount!: number;
  public notes?: string;
  public customerNotes?: string;
  public beforePhotos?: string[];
  public afterPhotos?: string[];
  public services!: string[];
  public materials!: string[];
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual field for job duration
  get duration(): string {
    if (this.actualDuration) {
      const hours = Math.floor(this.actualDuration / 60);
      const minutes = this.actualDuration % 60;
      return `${hours}h ${minutes}m`;
    }
    return `${Math.floor(this.estimatedDuration / 60)}h ${this.estimatedDuration % 60}m (estimated)`;
  }

  // Virtual field for profit
  get profit(): number {
    return this.totalPrice - (this.materials?.length * 10 || 0); // Simple profit calculation
  }
}

Job.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    carId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cars',
        key: 'id',
      },
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    jobType: {
      type: DataTypes.ENUM('basic_wash', 'full_detail', 'interior_detail', 'exterior_detail', 'premium_detail', 'custom'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium',
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    scheduledTime: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '09:00',
    },
    estimatedDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 15, // Minimum 15 minutes
        max: 480, // Maximum 8 hours
      },
    },
    actualDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    customerNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    beforePhotos: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    afterPhotos: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    services: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    materials: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'jobs',
    modelName: 'Job',
    timestamps: true,
  }
);

// Define associations
Job.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Job.belongsTo(Car, { foreignKey: 'carId', as: 'car' });
Job.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedStaff' });

Customer.hasMany(Job, { foreignKey: 'customerId', as: 'jobs' });
Car.hasMany(Job, { foreignKey: 'carId', as: 'jobs' });
User.hasMany(Job, { foreignKey: 'assignedTo', as: 'assignedJobs' });

export default Job; 