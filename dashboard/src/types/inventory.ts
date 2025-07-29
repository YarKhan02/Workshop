// Inventory Management Types
export interface ProductVariant {
  id: string;
  variant_name: string;
  sku: string;
  price: number;
  quantity: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  created_at: string;
  variants: ProductVariant[];
}

export interface FlattenedInventoryVariant extends ProductVariant {
  productName: string;
  category: string;
}

// Form data types
export interface ProductFormData {
  name: string;
  category: string;
  variant_name: string;
  price: number;
  quantity: number;
}

export interface ProductCreateData {
  name: string;
  category: string;
  variant: {
    variant_name: string;
    price: number;
    quantity: number;
  };
}

export interface ProductVariantFormData {
  variant_name: string;
  price: number;
  quantity: number;
}

export interface ProductVariantCreateData {
  variant_name: string;
  price: number;
  quantity: number;
}

export interface ProductVariantUpdateData {
  price: number;
  quantity: number;
}

// Modal component props
export interface AddInventoryModalProps {
  open: boolean;
  onClose: () => void;
}

export interface EditInventoryModalProps {
  open: boolean;
  onClose: () => void;
  inventory: {
    id: string;
    price: number;
    quantity: number;
  } | null;
}

export interface AddVariantModalProps {
  open: boolean;
  onClose: () => void;
  productId: string | null;
  productName?: string;
}

// Table and display component props
export interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (variant: ProductVariant) => void;
  onDelete: (variantId: string) => void;
  onAddVariant: (product: Product) => void;
}

export interface InventoryFilters {
  search?: string;
  category?: string;
  stockLevel?: 'low' | 'medium' | 'high' | 'out';
}

export interface InventoryStatsData {
  totalProducts: number;
  totalVariants: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}

export interface InventoryStatsProps {
  stats: InventoryStatsData;
  isLoading: boolean;
}

// API response types
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface ProductApiResponse {
  data: Product[];
  message?: string;
}

export interface ProductVariantApiResponse {
  data: ProductVariant;
  message?: string;
}

// Search and filter types
export interface ProductSearchFields {
  name: boolean;
  category: boolean;
  variant_name: boolean;
  sku: boolean;
}

// Mutation variables
export interface ProductMutationVariables {
  productData: ProductCreateData;
}

export interface ProductVariantMutationVariables {
  productId: string;
  variantData: ProductVariantCreateData;
}

export interface ProductVariantUpdateMutationVariables {
  variantId: string;
  variantData: ProductVariantUpdateData;
}

export interface ProductVariantDeleteMutationVariables {
  variantId: string;
}
