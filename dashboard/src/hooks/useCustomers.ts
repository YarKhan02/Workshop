import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { customerAPI, customerQueries } from '../api/customers';
import type { Customer, CustomerUpdateData, CustomerCreateData, CustomerMutationVariables } from '../types/customer';

// Hook for fetching customers list
export const useCustomers = () => {
  return useQuery(customerQueries.list());
};

// Hook for fetching single customer
export const useCustomer = (customerId: number) => {
  return useQuery(customerQueries.detail(customerId));
};

// Hook for updating customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }: CustomerMutationVariables) =>
      customerAPI.updateCustomer(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueries.keys.all });
      toast.success('Customer updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update customer';
      toast.error(errorMessage);
      console.error('Error updating customer:', error);
    },
  });
};

// Hook for creating customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerData: CustomerCreateData) =>
      customerAPI.createCustomer(customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueries.keys.all });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create customer';
      toast.error(errorMessage);
      console.error('Error creating customer:', error);
    },
  });
};

// Hook for customer search and filtering
export const useCustomerSearch = (customers: Customer[], searchTerm: string) => {
  return customers.filter(customer =>
    customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone_number.includes(searchTerm)
  );
};

// Hook for customer pagination
export const useCustomerPagination = (customers: Customer[], itemsPerPage: number = 10) => {
  const paginateCustomers = (currentPage: number) => {
    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage);

    return {
      customers: paginatedCustomers,
      totalPages,
      startIndex,
      currentPage,
      totalItems: customers.length,
    };
  };

  return paginateCustomers;
};
