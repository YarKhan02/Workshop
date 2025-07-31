import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit, Package, Tag, Hash, Search } from 'lucide-react';
import { useTheme, cn } from '../../ui';
import type { Product, ProductVariant } from '../../../types/inventory';
import { formatCurrency } from '../../../utils/currency';

interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (variant: ProductVariant) => void;
  onDelete: (variantId: string) => void;
  onAddVariant: (product: Product) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  isLoading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onAddVariant,
}) => {
  const { theme } = useTheme();
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // Filter products based on search term
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];
    if (!searchTerm.trim()) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.variants.some(
          (variant) =>
            variant.variant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            variant.sku.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  }, [products, searchTerm]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 overflow-hidden">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 overflow-hidden">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">Get started by adding your first product to inventory</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 overflow-hidden">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Search className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">No results found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search terms or clear the search to see all products
            </p>
            <button
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              onClick={() => onSearchChange("")}
            >
              Clear Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Results Indicator */}
      {searchTerm && (
        <div className={cn("border border-blue-700/50 px-6 py-3 rounded-lg", "bg-blue-900/30")}>
          <div className="flex items-center justify-between">
            <p className={cn("text-sm", "text-blue-300")}>
              Showing <span className="font-semibold">{filteredProducts.length}</span> results for "
              <span className="font-semibold">{searchTerm}</span>"
            </p>
            <button
              onClick={() => onSearchChange("")}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Main Products Table */}
      <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-900/80 to-slate-900/80 border-b border-gray-600/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/30">
              {filteredProducts.map((product) => (
                <React.Fragment key={product.id}>
                  {/* Product Row */}
                  <tr 
                    className="hover:bg-gray-700/30 transition-colors duration-200 cursor-pointer"
                    onClick={() => toggleExpand(product.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {expandedProducts.has(product.id) ? (
                            <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", theme.textSecondary)} />
                          ) : (
                            <ChevronRight className={cn("h-5 w-5 transition-transform duration-200", theme.textSecondary)} />
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={cn("p-2 rounded-lg", theme.backgroundSecondary)}>
                            <Package className="h-5 w-5 text-orange-400" />
                          </div>
                          <div>
                            <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>{product.name}</h3>
                            <p className={cn("text-sm", theme.textSecondary)}>Product ID: {product.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="px-3 py-1 bg-gray-700/50 text-gray-200 rounded-full text-sm font-medium border border-gray-600/30">
                          {product.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-gray-400" />
                        <span className="text-lg font-semibold text-gray-100">{product.variants.length}</span>
                        <span className="text-sm text-gray-400">variants</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Expanded Variants Row */}
                  {expandedProducts.has(product.id) && (
                    <tr>
                      <td colSpan={4} className="px-0 py-0">
                        <div className="bg-gray-800/30 border-t border-gray-700/50">
                          <div className="px-6 py-4">
                            <div className="bg-gradient-to-br from-gray-800/60 to-slate-800/60 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden">
                              {/* Variants Header */}
                              <div className="bg-gray-800/70 px-4 py-3 border-b border-gray-700/50">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                    {product.name} - Product Variants
                                  </h4>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddVariant(product);
                                    }}
                                    className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                                    title="Add new variant"
                                  >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Variant</span>
                                  </button>
                                </div>
                              </div>

                              {/* Variants Table */}
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="bg-gradient-to-r from-gray-900/80 to-slate-900/80 border-b border-gray-600/30">
                                    <tr>
                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Variant Name
                                      </th>
                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        SKU
                                      </th>
                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Price
                                      </th>
                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Stock
                                      </th>
                                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-600/30">
                                    {product.variants.map((variant) => (
                                      <tr key={variant.id} className="hover:bg-gray-700/30 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="font-medium text-gray-100">{variant.variant_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span className="font-mono bg-gray-700/50 text-gray-200 px-2 py-1 rounded text-xs border border-gray-600/30">
                                            {variant.sku}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="text-lg font-semibold text-gray-100">{formatCurrency(variant.price)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center space-x-2">
                                            <div
                                              className={`w-2 h-2 rounded-full ${
                                                variant.quantity > 10
                                                  ? "bg-green-400"
                                                  : variant.quantity > 0
                                                    ? "bg-yellow-400"
                                                    : "bg-red-400"
                                              }`}
                                            ></div>
                                            <span className="font-semibold text-gray-100">{variant.quantity}</span>
                                            <span className="text-sm text-gray-400">in stock</span>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                          <div className="flex items-center justify-end space-x-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(variant);
                                              }}
                                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-colors"
                                              title="Edit variant"
                                            >
                                              <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(variant.id);
                                              }}
                                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                                              title="Delete variant"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
