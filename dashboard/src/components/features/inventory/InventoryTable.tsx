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
      <div className={theme.components.inventory.loadingContainer}>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className={theme.components.inventory.loadingSpinner}></div>
            <p className={cn(theme.components.inventory.loadingText)}>Loading inventory...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={theme.components.inventory.emptyContainer}>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Package className={theme.components.inventory.emptyIcon} />
            <h3 className={cn(theme.components.inventory.emptyTitle)}>No products found</h3>
            <p className={cn(theme.components.inventory.emptySubtitle)}>Get started by adding your first product to inventory</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className={theme.components.inventory.noResultsContainer}>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Search className={theme.components.inventory.noResultsIcon} />
            <h3 className={cn(theme.components.inventory.noResultsTitle)}>No results found</h3>
            <p className={cn(theme.components.inventory.noResultsSubtitle)}>
              Try adjusting your search terms or clear the search to see all products
            </p>
            <button
              className={theme.components.inventory.clearSearchButton}
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
    <div className={theme.components.inventory.container}>
      {/* Search Results Indicator */}
      {searchTerm && (
        <div className={cn(theme.components.inventory.searchResults, theme.components.inventory.searchResultsBg)}>
          <div className="flex items-center justify-between">
            <p className={cn(theme.components.inventory.searchResultsText)}>
              Showing <span className="font-semibold">{filteredProducts.length}</span> results for "
              <span className="font-semibold">{searchTerm}</span>"
            </p>
            <button
              onClick={() => onSearchChange("")}
              className={theme.components.inventory.searchResultsClearButton}
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      {/* Main Products Table */}
      <div className={theme.components.inventory.mainTable}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme.primary}>
              <tr>
                <th className={cn(theme.components.inventory.tableCell, "text-left text-xs font-medium text-gray-300 uppercase tracking-wider")}>
                  Product
                </th>
                <th className={cn(theme.components.inventory.tableCell, "text-left text-xs font-medium text-gray-300 uppercase tracking-wider")}>
                  Category
                </th>
                <th className={cn(theme.components.inventory.tableCell, "text-left text-xs font-medium text-gray-300 uppercase tracking-wider")}>
                  Variants
                </th>
                <th className={cn(theme.components.inventory.tableCell, "text-left text-xs font-medium text-gray-300 uppercase tracking-wider")}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/30">
              {filteredProducts.map((product) => (
                <React.Fragment key={product.id}>
                  {/* Product Row */}
                  <tr 
                    className={cn(theme.home.sectionBg, theme.components.inventory.tableRowHover)}
                    onClick={() => toggleExpand(product.id)}
                  >
                    <td className={theme.components.inventory.tableCell}>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {expandedProducts.has(product.id) ? (
                            <ChevronDown className={cn(theme.components.inventory.expandIcon, theme.textSecondary)} />
                          ) : (
                            <ChevronRight className={cn(theme.components.inventory.expandIcon, theme.textSecondary)} />
                          )}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className={cn(theme.components.inventory.productIcon, theme.backgroundSecondary)}>
                            <Package className="h-5 w-5 text-orange-400" />
                          </div>
                          <div>
                            <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>{product.name}</h3>
                            <p className={cn(theme.components.inventory.productId, theme.textSecondary)}>Product ID: {product.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={theme.components.inventory.tableCell}>
                      <div className="flex items-center space-x-2">
                        <Tag className={theme.components.inventory.categoryIcon} />
                        <span className={theme.components.inventory.categoryBadge}>
                          {product.category}
                        </span>
                      </div>
                    </td>
                    <td className={theme.components.inventory.tableCell}>
                      <div className="flex items-center space-x-2">
                        <Hash className={theme.components.inventory.variantsCountIcon} />
                        <span className={theme.components.inventory.variantsCount}>{product.variants.length}</span>
                        <span className="text-sm text-gray-400">variants</span>
                      </div>
                    </td>
                    <td className={theme.components.inventory.tableCell}>
                      <span className={theme.components.inventory.statusBadge}>
                        Active
                      </span>
                    </td>
                  </tr>

                  {/* Expanded Variants Row */}
                  {expandedProducts.has(product.id) && (
                    <tr>
                      <td colSpan={4} className={theme.components.inventory.expandedVariants}>
                        <div className={theme.components.inventory.variantsContainer}>
                          <div className="px-6 py-4">
                            <div className={theme.components.inventory.variantsHeader}>
                              {/* Variants Header */}
                              <div className={theme.components.inventory.variantsHeaderBg}>
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className={theme.components.inventory.variantsHeaderTitle}>
                                    {product.name} - Product Variants
                                  </h4>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddVariant(product);
                                    }}
                                    className={theme.components.inventory.addVariantButton}
                                    title="Add new variant"
                                  >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Variant</span>
                                  </button>
                                </div>
                              </div>

                              {/* Variants Table */}
                              <div className={theme.components.inventory.variantsTable}>
                                <table className="w-full">
                                  <thead className={theme.components.inventory.variantsTableHeader}>
                                    <tr>
                                      <th className={cn(theme.components.inventory.variantsTableCell, "text-left text-xs font-medium text-gray-300 uppercase tracking-wider")}>
                                        Variant Name
                                      </th>
                                      <th className={cn(theme.components.inventory.variantsTableCell, "text-left text-xs font-medium text-gray-300 uppercase tracking-wider")}>
                                        SKU
                                      </th>
                                      <th className={cn(theme.components.inventory.variantsTableCell, "text-left text-xs font-medium text-gray-300 uppercase tracking-wider")}>
                                        Price
                                      </th>
                                      <th className={cn(theme.components.inventory.variantsTableCell, "text-left text-xs font-medium text-gray-300 uppercase tracking-wider")}>
                                        Stock
                                      </th>
                                      <th className={cn(theme.components.inventory.variantsTableCell, "text-right text-xs font-medium text-gray-300 uppercase tracking-wider")}>
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-600/30">
                                    {product.variants.map((variant) => (
                                      <tr key={variant.id} className={cn(theme.home.sectionBg, theme.components.inventory.variantsTableRowHover)}>
                                        <td className={theme.components.inventory.variantsTableCell}>
                                          <div className="font-medium text-gray-100">{variant.variant_name}</div>
                                        </td>
                                        <td className={theme.components.inventory.variantsTableCell}>
                                          <span className={theme.components.inventory.skuBadge}>
                                            {variant.sku}
                                          </span>
                                        </td>
                                        <td className={theme.components.inventory.variantsTableCell}>
                                          <div className="text-lg font-semibold text-gray-100">{formatCurrency(variant.price)}</div>
                                        </td>
                                        <td className={theme.components.inventory.variantsTableCell}>
                                          <div className="flex items-center space-x-2">
                                            <div
                                              className={cn(
                                                theme.components.inventory.stockIndicator,
                                                variant.quantity > 10
                                                  ? theme.components.inventory.stockIndicatorGreen
                                                  : variant.quantity > 0
                                                    ? theme.components.inventory.stockIndicatorYellow
                                                    : theme.components.inventory.stockIndicatorRed
                                              )}
                                            ></div>
                                            <span className={theme.components.inventory.stockText}>{variant.quantity}</span>
                                            <span className="text-sm text-gray-400">in stock</span>
                                          </div>
                                        </td>
                                        <td className={theme.components.inventory.variantsTableCell}>
                                          <div className="flex items-center justify-end space-x-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(variant);
                                              }}
                                              className={cn(theme.components.table.actionButton, theme.components.table.actionButtonEdit)}
                                              title="Edit variant"
                                            >
                                              <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(variant.id);
                                              }}
                                              className={cn(theme.components.table.actionButton, theme.components.table.actionButtonDelete)}
                                              title=" variaDeletent"
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
