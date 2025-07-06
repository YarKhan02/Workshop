import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  PARTIAL = 'partial'
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  UPI = 'upi',
  WALLET = 'wallet',
  CHECK = 'check'
}

export interface InvoiceAttributes {
  id?: number;
  invoiceNumber: string;
  customerId: number;
  jobId?: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  dueDate: Date;
  paidDate?: Date;
  notes?: string;
  terms?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceCreationAttributes extends Omit<InvoiceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> implements InvoiceAttributes {
  public id!: number;
  public invoiceNumber!: string;
  public customerId!: number;
  public jobId?: number;
  public subtotal!: number;
  public taxAmount!: number;
  public discountAmount!: number;
  public totalAmount!: number;
  public status!: InvoiceStatus;
  public paymentMethod?: PaymentMethod;
  public dueDate!: Date;
  public paidDate?: Date;
  public notes?: string;
  public terms?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
      },
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id',
      },
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'jobs',
        key: 'id',
      },
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
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
    status: {
      type: DataTypes.ENUM(...Object.values(InvoiceStatus)),
      allowNull: false,
      defaultValue: InvoiceStatus.DRAFT,
    },
    paymentMethod: {
      type: DataTypes.ENUM(...Object.values(PaymentMethod)),
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paidDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'invoices',
    modelName: 'Invoice',
    timestamps: true,
  }
);

export default Invoice;

// Import models for associations
import Customer from './Customer';
import Job from './Job';
import InvoiceItem from './InvoiceItem';

// Define associations
Invoice.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Invoice.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });

Customer.hasMany(Invoice, { foreignKey: 'customerId', as: 'invoices' });
Job.hasMany(Invoice, { foreignKey: 'jobId', as: 'invoices' }); 