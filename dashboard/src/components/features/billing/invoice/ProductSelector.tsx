import React from 'react';
import { Loader2, Search } from 'lucide-react';
import type { ProductVariant } from '../../../../types';

interface ProductSelectorProps {
  isOpen: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  variants: (ProductVariant & { productName: string })[];
  isLoading: boolean;
  onAddVariant: (variant: ProductVariant & { productName: string }) => void;
  formatCurrency: (amount: number) => string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  isOpen,
  searchTerm,
  onSearchChange,
  variants,
  isLoading,
  onAddVariant,
  formatCurrency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mb-6">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search products or variants..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
        />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          <span className="ml-2 text-gray-300">Loading products...</span>
        </div>
      ) : variants.length === 0 ? (
        <p className="text-center text-gray-400 py-4">No products found.</p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-600"
            >
              <div>
                <p className="font-medium text-white">
                  {variant.productName} - {variant.variant_name}
                </p>
                <p className="text-sm text-gray-400">
                  SKU: {variant.sku} | Price: {formatCurrency(variant.price)} | Stock: {variant.quantity}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAddVariant(variant)}
                disabled={variant.quantity === 0}
                className="ml-4 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
