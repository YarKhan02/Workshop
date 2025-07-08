import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Inventory from '../models/Inventory';

// Get all inventories with pagination and search
export const getInventories = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause: any = { isActive: true };
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: inventories } = await Inventory.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      inventories,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error('Get inventories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single inventory by ID
export const getInventoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      res.status(404).json({ error: 'Inventory not found' });
      return;
    }
    res.json({ inventory });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new inventory
export const createInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventoryData = req.body;
    // Check if SKU already exists (if provided)
    if (inventoryData.sku) {
      const existingSku = await Inventory.findOne({
        where: { sku: inventoryData.sku },
      });
      if (existingSku) {
        res.status(400).json({ error: 'SKU already exists' });
        return;
      }
    }
    const inventory = await Inventory.create(inventoryData);
    res.status(201).json({
      message: 'Inventory created successfully',
      inventory,
    });
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update inventory
export const updateInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      res.status(404).json({ error: 'Inventory not found' });
      return;
    }
    // Check if SKU is being changed and if it already exists
    if (updateData.sku && updateData.sku !== inventory.sku) {
      const existingSku = await Inventory.findOne({
        where: { sku: updateData.sku },
      });
      if (existingSku) {
        res.status(400).json({ error: 'SKU already exists' });
        return;
      }
    }
    await inventory.update(updateData);
    res.json({
      message: 'Inventory updated successfully',
      inventory,
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete inventory (soft delete)
export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      res.status(404).json({ error: 'Inventory not found' });
      return;
    }
    await inventory.update({ isActive: false });
    res.json({ message: 'Inventory deleted successfully' });
  } catch (error) {
    console.error('Delete inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 