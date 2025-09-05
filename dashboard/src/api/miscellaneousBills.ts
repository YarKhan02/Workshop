import { apiClient } from './client';
import type { 
  MiscellaneousBill, 
  MiscellaneousBillCreateData, 
  MiscellaneousBillUpdateData
} from '../types';

/**
 * Fetch all miscellaneous bills
 */
export const fetchMiscellaneousBills = async (): Promise<MiscellaneousBill[]> => {
  const response = await apiClient.get('/miscellaneous-bills/bills/');
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch a single miscellaneous bill by ID
 */
export const fetchMiscellaneousBillById = async (billId: string): Promise<MiscellaneousBill> => {
  const response = await apiClient.get(`/miscellaneous-bills/${billId}/one-bill/`);
  return response.data;
};

/**
 * Create a new miscellaneous bill
 */
export const createMiscellaneousBill = async (billData: MiscellaneousBillCreateData): Promise<MiscellaneousBill> => {
  const response = await apiClient.post('/miscellaneous-bills/add-bill/', billData);
  return response.data;
};

/**
 * Update an existing miscellaneous bill
 */
export const updateMiscellaneousBill = async (
  billId: string, 
  billData: MiscellaneousBillUpdateData
): Promise<MiscellaneousBill> => {
  const response = await apiClient.patch(`/miscellaneous-bills/${billId}/edit-bill/`, billData);
  return response.data;
};

/**
 * Delete a miscellaneous bill
 */
// export const deleteMiscellaneousBill = async (billId: string): Promise<void> => {
//   await apiClient.delete(`/miscellaneous-bills/${billId}/delete-bill/`);
// };

// Export grouped API object for easy import
export const miscellaneousBillAPI = {
  fetchAll: fetchMiscellaneousBills,
  fetchById: fetchMiscellaneousBillById,
  create: createMiscellaneousBill,
  update: updateMiscellaneousBill,
//   delete: deleteMiscellaneousBill,
};
