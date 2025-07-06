import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Car from '../models/Car';
import Customer from '../models/Customer';

// Get all cars with pagination and search
export const getCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const customerId = req.query.customerId as string;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = { isActive: true };
    
    if (search) {
      whereClause[Op.or] = [
        { make: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
        { licensePlate: { [Op.like]: `%${search}%` } },
        { vin: { [Op.like]: `%${search}%` } },
        { color: { [Op.like]: `%${search}%` } },
      ];
    }

    if (customerId) {
      whereClause.customerId = customerId;
    }

    const { count, rows: cars } = await Car.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      cars,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single car by ID
export const getCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const car = await Car.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
      ],
    });

    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    res.json({ car });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new car
export const createCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const carData = req.body;
    
    // Convert empty string VIN to null
    if (carData.vin === '') {
      carData.vin = null;
    }

    // Check if license plate already exists
    const existingCar = await Car.findOne({
      where: { licensePlate: carData.licensePlate },
    });

    if (existingCar) {
      res.status(400).json({ error: 'License plate already exists' });
      return;
    }

    // Check if VIN already exists (if provided)
    if (carData.vin) {
      const existingVin = await Car.findOne({
        where: { vin: carData.vin },
      });

      if (existingVin) {
        res.status(400).json({ error: 'VIN already exists' });
        return;
      }
    }

    // Verify customer exists
    const customer = await Customer.findByPk(carData.customerId);
    if (!customer) {
      res.status(400).json({ error: 'Customer not found' });
      return;
    }

    const car = await Car.create(carData);

    // Fetch the created car with customer information
    const createdCar = await Car.findByPk(car.id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
      ],
    });

    res.status(201).json({
      message: 'Car created successfully',
      car: createdCar,
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update car
export const updateCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Convert empty string VIN to null
    if (updateData.vin === '') {
      updateData.vin = null;
    }

    const car = await Car.findByPk(id);

    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    // Check if license plate is being changed and if it already exists
    if (updateData.licensePlate && updateData.licensePlate !== car.licensePlate) {
      const existingCar = await Car.findOne({
        where: { licensePlate: updateData.licensePlate },
      });

      if (existingCar) {
        res.status(400).json({ error: 'License plate already exists' });
        return;
      }
    }

    // Check if VIN is being changed and if it already exists
    if (updateData.vin && updateData.vin !== car.vin) {
      const existingVin = await Car.findOne({
        where: { vin: updateData.vin },
      });

      if (existingVin) {
        res.status(400).json({ error: 'VIN already exists' });
        return;
      }
    }

    await car.update(updateData);

    // Fetch the updated car with customer information
    const updatedCar = await Car.findByPk(id, {
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
      ],
    });

    res.json({
      message: 'Car updated successfully',
      car: updatedCar,
    });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete car (soft delete)
export const deleteCar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const car = await Car.findByPk(id);

    if (!car) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }

    // Soft delete by setting isActive to false
    await car.update({ isActive: false });

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get cars by customer ID
export const getCarsByCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;

    const cars = await Car.findAll({
      where: { customerId, isActive: true },
      order: [['createdAt', 'DESC']],
    });

    res.json({ cars });
  } catch (error) {
    console.error('Get cars by customer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 