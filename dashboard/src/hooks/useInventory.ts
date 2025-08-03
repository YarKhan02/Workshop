import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { inventoryAPI, inventoryQueries } from '../api/inventory';
import type { 
  ProductCreateData, 
  ProductVariantCreateData, 
  ProductVariantUpdateData,
  InventoryFilters
} from '../types/inventory';

// Query key utilities
export const inventoryQueryKeys = inventoryQueries.keys;

/**
 * Hook to fetch all products with optional filters
 */
export const useProducts = (filters?: InventoryFilters) => {
  return useQuery({
    queryKey: inventoryQueries.keys.productsList(filters),
    queryFn: () => inventoryAPI.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single product by ID
 */
export const useProduct = (productId: string | null) => {
  return useQuery({
    queryKey: inventoryQueries.keys.productDetail(productId!),
    queryFn: () => inventoryAPI.getProductById(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (category: string | null) => {
  return useQuery({
    queryKey: inventoryQueries.keys.byCategory(category!),
    queryFn: () => inventoryAPI.getProductsByCategory(category!),
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to search products
 */
export const useProductSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: inventoryQueries.keys.search(searchTerm),
    queryFn: () => inventoryAPI.searchProducts(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to fetch a single variant by ID
 */
export const useVariant = (variantId: string | null) => {
  return useQuery({
    queryKey: inventoryQueries.keys.variantDetail(variantId!),
    queryFn: () => inventoryAPI.getVariantById(variantId!),
    enabled: !!variantId,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation hooks

/**
 * Hook to create a new product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductCreateData) => inventoryAPI.createProduct(productData),
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: inventoryQueries.keys.products() });
      
      // Optimistically update the cache
      queryClient.setQueryData(inventoryQueries.keys.productDetail(newProduct.id), newProduct);
      
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      console.error('Failed to create product:', error);
      toast.error(error?.response?.data?.message || 'Failed to create product');
    },
  });
};

/**
 * Hook to delete a product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => inventoryAPI.deleteProduct(productId),
    onSuccess: (_, productId) => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: inventoryQueries.keys.products() });
      
      // Remove the product from cache
      queryClient.removeQueries({ queryKey: inventoryQueries.keys.productDetail(productId) });
      
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      console.error('Failed to delete product:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete product');
    },
  });
};

/**
 * Hook to create a new product variant
 */
export const useCreateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, variantData }: { productId: string; variantData: ProductVariantCreateData }) =>
      inventoryAPI.createVariant(productId, variantData),
    onSuccess: (_, { productId }) => {
      // Invalidate and refetch products list to get updated variants
      queryClient.invalidateQueries({ queryKey: inventoryQueries.keys.products() });
      queryClient.invalidateQueries({ queryKey: inventoryQueries.keys.productDetail(productId) });
      
      toast.success('Variant added successfully');
    },
    onError: (error: any) => {
      console.error('Failed to create variant:', error);
      toast.error(error?.response?.data?.message || 'Failed to add variant');
    },
  });
};

/**
 * Hook to update a product variant
 */
export const useUpdateVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, variantData }: { variantId: string; variantData: ProductVariantUpdateData }) =>
      inventoryAPI.updateVariant(variantId, variantData),
    onSuccess: (updatedVariant, { variantId }) => {
      // Invalidate products list to reflect changes
      queryClient.invalidateQueries({ queryKey: inventoryQueries.keys.products() });
      
      // Update the specific variant in cache if it exists
      queryClient.setQueryData(inventoryQueries.keys.variantDetail(variantId), updatedVariant);
      
      toast.success('Variant updated successfully');
    },
    onError: (error: any) => {
      console.error('Failed to update variant:', error);
      toast.error(error?.response?.data?.message || 'Failed to update variant');
    },
  });
};

/**
 * Hook to delete a product variant
 */
export const useDeleteVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) => inventoryAPI.deleteVariant(variantId),
    onSuccess: (_, variantId) => {
      // Invalidate products list to reflect changes
      queryClient.invalidateQueries({ queryKey: inventoryQueries.keys.products() });
      
      // Remove the variant from cache
      queryClient.removeQueries({ queryKey: inventoryQueries.keys.variantDetail(variantId) });
      
      toast.success('Variant deleted successfully');
    },
    onError: (error: any) => {
      console.error('Failed to delete variant:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete variant');
    },
  });
};

// Utility hooks

/**
 * Hook to get inventory statistics
 */
export const useInventoryStats = () => {
  const { data: products, isLoading } = useProducts();

  const stats = React.useMemo(() => {
    if (!products) return null;

    const totalProducts = products.length;
    const totalVariants = products.reduce((sum, product) => sum + product.variants.length, 0);
    const lowStockItems = products.reduce(
      (sum, product) => sum + product.variants.filter(v => v.quantity > 0 && v.quantity <= 10).length, 
      0
    );
    const outOfStockItems = products.reduce(
      (sum, product) => sum + product.variants.filter(v => v.quantity === 0).length, 
      0
    );
    const totalValue = products.reduce(
      (sum, product) => sum + product.variants.reduce((vSum, variant) => vSum + (variant.price * variant.quantity), 0), 
      0
    );

    return {
      totalProducts,
      totalVariants,
      lowStockItems,
      outOfStockItems,
      totalValue,
    };
  }, [products]);

  return { stats, isLoading };
};

/**
 * Hook to get flattened variants for easy filtering/searching
 */
export const useFlattenedVariants = (filters?: InventoryFilters) => {
  const { data: products, isLoading, error } = useProducts(filters);

  const flattenedVariants = React.useMemo(() => {
    if (!products) return [];

    return products.flatMap(product =>
      product.variants.map(variant => ({
        ...variant,
        productName: product.name,
        category: product.category,
      }))
    );
  }, [products]);

  return { flattenedVariants, isLoading, error };
};
