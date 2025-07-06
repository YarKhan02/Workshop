import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Customer from './Customer';

export interface CarAttributes {
  id?: number;
  customerId: number;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  mileage?: number;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission?: 'manual' | 'automatic';
  engineSize?: string;
  notes?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CarCreationAttributes extends Omit<CarAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Car extends Model<CarAttributes, CarCreationAttributes> implements CarAttributes {
  public id!: number;
  public customerId!: number;
  public make!: string;
  public model!: string;
  public year!: number;
  public color!: string;
  public licensePlate!: string;
  public vin?: string;
  public mileage?: number;
  public fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  public transmission?: 'manual' | 'automatic';
  public engineSize?: string;
  public notes?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual field for full car name
  get fullName(): string {
    return `${this.year} ${this.make} ${this.model}`;
  }
}

Car.init(
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
    make: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear() + 1,
      },
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [1, 30],
      },
    },
    licensePlate: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 20],
      },
    },
    vin: {
      type: DataTypes.STRING(17),
      allowNull: true,
      unique: true,
      validate: {
        len: [17, 17],
      },
    },
    mileage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    fuelType: {
      type: DataTypes.ENUM('gasoline', 'diesel', 'electric', 'hybrid'),
      allowNull: true,
    },
    transmission: {
      type: DataTypes.ENUM('manual', 'automatic'),
      allowNull: true,
    },
    engineSize: {
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
  },
  {
    sequelize,
    tableName: 'cars',
    modelName: 'Car',
    timestamps: true,
  }
);

// Define associations
Car.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Customer.hasMany(Car, { foreignKey: 'customerId', as: 'cars' });

export default Car; 