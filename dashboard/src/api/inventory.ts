import { apiClient } from './client';
import type { 
  Product, 
  ProductVariant, 
  ProductCreateData, 
  ProductVariantCreateData, 
  ProductVariantUpdateData,
  InventoryFilters,
  CategoryOption
} from '../types/inventory';

/**
 * Fetch available product categories
 */
export const fetchProductCategories = async (): Promise<CategoryOption[]> => {
  const response = await apiClient.get('/products/categories/');
  return response.data;
};

/**
 * Fetch all products with their variants
 */
export const fetchProducts = async (filters?: InventoryFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  
  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.category) {
    params.append('category', filters.category);
  }
  if (filters?.stockLevel) {
    params.append('stock_level', filters.stockLevel);
  }

  const response = await apiClient.get(`/products/details/?${params.toString()}`);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (productId: string): Promise<Product> => {
  const response = await apiClient.get(`/products/${productId}/`);
  return response.data;
};

/**
 * Create a new product with initial variant
 */
export const createProduct = async (productData: ProductCreateData): Promise<Product> => {
  const response = await apiClient.post('/products/add-product/', productData);
  return response.data;
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  await apiClient.delete(`/products/${productId}/del-product/`);
};

/**
 * Search products by various criteria
 */
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  const response = await apiClient.get(`/products/details/?search=${encodeURIComponent(searchTerm)}`);
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Get products by category
 */
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await apiClient.get(`/products/details/?category=${encodeURIComponent(category)}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Failed to fetch products for category:', category, error);
    return [];
  }
};

// Product Variant Operations

/**
 * Add a new variant to an existing product
 */
export const createProductVariant = async (
  productId: string, 
  variantData: ProductVariantCreateData
): Promise<ProductVariant> => {
  const response = await apiClient.post(`/variants/${productId}/add-variant/`, variantData);
  return response.data;
};

/**
 * Update an existing product variant
 */
export const updateProductVariant = async (
  variantId: string,
  variantData: ProductVariantUpdateData
): Promise<ProductVariant> => {
  const response = await apiClient.patch(`/variants/${variantId}/update-variant/`, variantData);
  return response.data;
};

/**
 * Delete a product variant
 */
export const deleteProductVariant = async (variantId: string): Promise<void> => {
  await apiClient.delete(`/variants/${variantId}/del-variant/`);
};

/**
 * Fetch variant by ID
 */
export const fetchVariantById = async (variantId: string): Promise<ProductVariant> => {
  const response = await apiClient.get(`/variants/${variantId}/`);
  return response.data;
};

// Inventory API object
export const inventoryAPI = {
  // Product operations
  getProducts: fetchProducts,
  getProductById: fetchProductById,
  createProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory: fetchProductsByCategory,
  
  // Variant operations
  createVariant: createProductVariant,
  updateVariant: updateProductVariant,
  deleteVariant: deleteProductVariant,
  getVariantById: fetchVariantById,
};

// Inventory query keys for React Query
export const inventoryQueries = {
  keys: {
    all: ['inventory'] as const,
    products: () => [...inventoryQueries.keys.all, 'products'] as const,
    productsList: (filters?: InventoryFilters) => [...inventoryQueries.keys.products(), 'list', filters] as const,
    productDetails: () => [...inventoryQueries.keys.products(), 'details'] as const,
    productDetail: (id: string) => [...inventoryQueries.keys.productDetails(), id] as const,
    variants: () => [...inventoryQueries.keys.all, 'variants'] as const,
    variantDetail: (id: string) => [...inventoryQueries.keys.variants(), id] as const,
    byCategory: (category: string) => [...inventoryQueries.keys.products(), 'category', category] as const,
    search: (term: string) => [...inventoryQueries.keys.products(), 'search', term] as const,
  },

  // Query functions for use with React Query
  productsList: (filters?: InventoryFilters) => ({
    queryKey: inventoryQueries.keys.productsList(filters),
    queryFn: () => inventoryAPI.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  }),

  productDetail: (productId: string) => ({
    queryKey: inventoryQueries.keys.productDetail(productId),
    queryFn: () => inventoryAPI.getProductById(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  variantDetail: (variantId: string) => ({
    queryKey: inventoryQueries.keys.variantDetail(variantId),
    queryFn: () => inventoryAPI.getVariantById(variantId),
    enabled: !!variantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  }),

  byCategory: (category: string) => ({
    queryKey: inventoryQueries.keys.byCategory(category),
    queryFn: () => inventoryAPI.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 10, // 10 minutes
  }),

  search: (searchTerm: string) => ({
    queryKey: inventoryQueries.keys.search(searchTerm),
    queryFn: () => inventoryAPI.searchProducts(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
  }),
};

export default inventoryAPI; 