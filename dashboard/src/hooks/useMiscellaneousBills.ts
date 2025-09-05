import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { miscellaneousBillAPI } from '../api/miscellaneousBills';
import type { 
  MiscellaneousBillCreateData, 
  MiscellaneousBillUpdateData 
} from '../types';

// Query Keys
const QUERY_KEYS = {
  miscellaneousBills: ['miscellaneousBills'] as const,
  miscellaneousBill: (id: string) => ['miscellaneousBills', id] as const,
};

/**
 * Hook to fetch all miscellaneous bills
 */
export const useMiscellaneousBills = () => {
  return useQuery({
    queryKey: QUERY_KEYS.miscellaneousBills,
    queryFn: miscellaneousBillAPI.fetchAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single miscellaneous bill by ID
 */
export const useMiscellaneousBill = (billId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.miscellaneousBill(billId),
    queryFn: () => miscellaneousBillAPI.fetchById(billId),
    enabled: !!billId,
  });
};

/**
 * Hook to create a new miscellaneous bill
 */
export const useCreateMiscellaneousBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billData: MiscellaneousBillCreateData) => 
      miscellaneousBillAPI.create(billData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.miscellaneousBills });
      toast.success('Bill created successfully!');
    },
    onError: (error: any) => {
      console.error('Error creating bill:', error);
      toast.error('Failed to create bill');
    },
  });
};

/**
 * Hook to update a miscellaneous bill
 */
export const useUpdateMiscellaneousBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billId, billData }: { billId: string; billData: MiscellaneousBillUpdateData }) =>
      miscellaneousBillAPI.update(billId, billData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.miscellaneousBills });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.miscellaneousBill(variables.billId) });
      toast.success('Bill updated successfully!');
    },
    onError: (error: any) => {
      console.error('Error updating bill:', error);
      toast.error('Failed to update bill');
    },
  });
};

/**
 * Hook to delete a miscellaneous bill
 */
// export const useDeleteMiscellaneousBill = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (billId: string) => miscellaneousBillAPI.delete(billId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.miscellaneousBills });
//       toast.success('Bill deleted successfully!');
//     },
//     onError: (error: any) => {
//       console.error('Error deleting bill:', error);
//       toast.error('Failed to delete bill');
//     },
//   });
// };
