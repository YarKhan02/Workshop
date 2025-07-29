"use client"

import React, { useState } from "react"
import { Plus } from "lucide-react"

// Common Components
import {
  PageHeader,
  SearchBar,
  Pagination,
} from '../components/common'

// Feature Components
import AddInventoryModal from "../components/features/inventory/AddInventoryModal"
import EditInventoryModal from "../components/features/inventory/EditInventoryModal"
import AddVariantModal from "../components/features/inventory/AddVariantModal"
import InventoryTable from "../components/features/inventory/InventoryTable"

// Hooks
import { useProducts, useDeleteVariant } from "../hooks/useInventory"
import { usePagination } from '../hooks/usePagination'
import { useTableData } from '../hooks/useTableData'
import type { Product, ProductVariant } from "../types/inventory"

const InventoryPage: React.FC = () => {
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false)
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<{
    id: string
    name: string
  } | null>(null)
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("")

  // Use global pagination hook
  const { currentPage, itemsPerPage, onPageChange, resetToFirstPage } = usePagination()

  // Data fetching
  const { data: products, isLoading } = useProducts({ search: searchTerm })
  const deleteVariantMutation = useDeleteVariant()

  // Ensure products is always an array
  const productsArray = Array.isArray(products) ? products : []
  
  // Use the generic table data hook for pagination
  const { paginateItems } = useTableData(productsArray, {
    searchTerm,
    searchFields: ['name', 'category'],
    itemsPerPage,
  })

  // Get paginated data
  const paginationData = paginateItems(currentPage)

  const handleEdit = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setIsEditModalOpen(true)
  }

  const handleAddVariant = (product: Product) => {
    setSelectedProductForVariant({
      id: product.id,
      name: product.name,
    })
    setIsAddVariantModalOpen(true)
  }

  const handleDelete = async (variantId: string) => {
    if (!window.confirm("Delete this variant?")) return
    
    try {
      await deleteVariantMutation.mutateAsync(variantId)
    } catch (error) {
      // Error handling is done in the hook
      console.error('Delete variant error:', error)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    resetToFirstPage() // Reset to first page when searching
  }

  const handlePageChange = (page: number) => {
    onPageChange(page)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Inventory Management"
        subtitle="Manage your products and variants"
        actionButton={{
          label: 'Add Product',
          icon: Plus,
          onClick: () => setIsAddModalOpen(true),
          variant: 'primary',
        }}
      />

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        placeholder="Search products, categories, variants, or SKUs..."
      />

      {/* Inventory Table */}
      <div>
        <InventoryTable
          products={paginationData.items}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddVariant={handleAddVariant}
        />

        {/* Pagination */}
        {paginationData.totalPages > 1 && (
          <Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            startIndex={paginationData.startIndex}
            itemsPerPage={itemsPerPage}
            totalItems={paginationData.totalItems}
            onPageChange={handlePageChange}
            itemName="products"
          />
        )}
      </div>

      {/* Modals */}
      <AddInventoryModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditInventoryModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        inventory={selectedVariant}
      />
      <AddVariantModal
        open={isAddVariantModalOpen}
        onClose={() => {
          setIsAddVariantModalOpen(false)
          setSelectedProductForVariant(null)
        }}
        productId={selectedProductForVariant?.id || null}
        productName={selectedProductForVariant?.name}
      />
    </div>
  )
}

export default InventoryPage
