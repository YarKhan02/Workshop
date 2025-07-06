import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface CustomerAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
  isActive: boolean;
  totalSpent: number;
  lastVisit?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerCreationAttributes extends Omit<CustomerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public zipCode?: string;
  public dateOfBirth?: Date;
  public gender?: 'male' | 'female' | 'other';
  public emergencyContact?: string;
  public emergencyPhone?: string;
  public notes?: string;
  public isActive!: boolean;
  public totalSpent!: number;
  public lastVisit?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual field for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [10, 20],
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    emergencyPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    totalSpent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    lastVisit: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'customers',
    modelName: 'Customer',
    timestamps: true,
  }
);

export default Customer; 