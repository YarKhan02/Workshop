import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit, Package, Tag, Hash, Search } from 'lucide-react';
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
    <div className="bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-md rounded-2xl border border-gray-700/30 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-900/80 to-slate-900/80 border-b border-gray-600/30 px-6 py-4">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-300 uppercase tracking-wider">
          <div className="col-span-5">Product</div>
          <div className="col-span-3">Category</div>
          <div className="col-span-2">Variants</div>
          <div className="col-span-2">Status</div>
        </div>
      </div>

      {/* Search Results Indicator */}
      {searchTerm && (
        <div className="bg-blue-900/30 border-b border-blue-700/50 px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-300">
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

      {/* Table Body */}
      <div className="divide-y divide-gray-700/50">
        {filteredProducts.map((product) => (
          <React.Fragment key={product.id}>
            {/* Product Row */}
            <div
              className="cursor-pointer hover:bg-gray-700/30 transition-colors duration-150"
              onClick={() => toggleExpand(product.id)}
            >
              <div className="px-6 py-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {expandedProducts.has(product.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400 transition-transform duration-200" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-700/50 rounded-lg">
                        <Package className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100">{product.name}</h3>
                        <p className="text-sm text-gray-400">Product ID: {product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="px-3 py-1 bg-gray-700/50 text-gray-200 rounded-full text-sm font-medium border border-gray-600/30">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span className="text-lg font-semibold text-gray-100">{product.variants.length}</span>
                      <span className="text-sm text-gray-400">variants</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Variants */}
            {expandedProducts.has(product.id) && (
              <div className="bg-gray-800/30 border-t border-gray-700/50">
                <div className="px-6 py-4">
                  <div className="bg-gradient-to-br from-gray-800/60 to-slate-800/60 backdrop-blur-sm rounded-xl border border-gray-700/40 overflow-hidden">
                    {/* Variants Header */}
                    <div className="bg-gray-800/70 px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Product Variants
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

                    {/* Variants List */}
                    <div className="divide-y divide-gray-700/50">
                      {product.variants.map((variant) => (
                        <div key={variant.id} className="px-4 py-4 hover:bg-gray-700/20 transition-colors">
                          <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-3">
                              <div className="font-medium text-gray-100">{variant.variant_name}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-sm text-gray-400">
                                <span className="font-mono bg-gray-700/50 text-gray-200 px-2 py-1 rounded text-xs border border-gray-600/30">
                                  {variant.sku}
                                </span>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-lg font-semibold text-gray-100">{formatCurrency(variant.price)}</div>
                            </div>
                            <div className="col-span-2">
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
                            </div>
                            <div className="col-span-3 flex items-center justify-end space-x-2">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InventoryTable;
