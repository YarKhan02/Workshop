import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

export interface InvoiceItemAttributes {
  id?: number;
  invoiceId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceItemCreationAttributes extends Omit<InvoiceItemAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class InvoiceItem extends Model<InvoiceItemAttributes, InvoiceItemCreationAttributes> implements InvoiceItemAttributes {
  public id!: number;
  public invoiceId!: number;
  public description!: string;
  public quantity!: number;
  public unitPrice!: number;
  public totalPrice!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

InvoiceItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'invoices',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'invoice_items',
    modelName: 'InvoiceItem',
    timestamps: true,
  }
);

export default InvoiceItem;

// Import models for associations
import Invoice from './Invoice';

// Define associations
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' }); 