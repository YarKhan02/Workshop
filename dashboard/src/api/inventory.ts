import { apiClient } from './client';
import type { Inventory } from '../types';

export const getInventories = async (params?: any) => {
  const response = await apiClient.get('/inventory', { params });
  return response.data;
};

export const getInventoryById = async (id: number) => {
  const response = await apiClient.get(`/inventory/${id}`);
  return response.data;
};

export const createInventory = async (data: Partial<Inventory>) => {
  const response = await apiClient.post('/inventory', data);
  return response.data;
};

export const updateInventory = async (id: number, data: Partial<Inventory>) => {
  const response = await apiClient.put(`/inventory/${id}`, data);
  return response.data;
};

export const deleteInventory = async (id: number) => {
  const response = await apiClient.delete(`/inventory/${id}`);
  return response.data;
}; 