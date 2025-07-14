"use client"

import React, { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronDown, ChevronRight, Plus, Trash2, Edit, Package, Tag, Hash, Search } from "lucide-react"
import toast from "react-hot-toast"
import AddInventoryModal from "../components/inventory/AddInventoryModal"
import EditInventoryModal from "../components/inventory/EditInventoryModal"
import AddVariantModal from "../components/inventory/AddVariantModal"
import type { Product, ProductVariant } from "../types"

const InventoryPage: React.FC = () => {
  const [token] = useState(localStorage.getItem("token") || "")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const queryClient = useQueryClient()

  // Add Variant Modal State
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false)
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<{
    uuid: string
    name: string
  } | null>(null)

  const { data: products, isLoading } = useQuery({
    queryKey: ["inventories"],
    queryFn: async (): Promise<Product[]> => {
      const res = await fetch("http://localhost:8000/products/details/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch inventory")
      return res.json()
    },
    enabled: !!token,
  })

  // Filter products based on search term
  const filteredProducts = React.useMemo(() => {
    if (!products) return []
    if (!searchTerm.trim()) return products

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.variants.some(
          (variant) =>
            variant.variant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            variant.sku.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    )
  }, [products, searchTerm])

  const toggleExpand = (uuid: string) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev)
      newSet.has(uuid) ? newSet.delete(uuid) : newSet.add(uuid)
      return newSet
    })
  }

  const handleDelete = async (variantUuid: string) => {
    if (!window.confirm("Delete this variant?")) return
    try {
      const res = await fetch(`http://localhost:8000/variants/${variantUuid}/del-variant/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      toast.success("Variant deleted")

      await queryClient.invalidateQueries({ queryKey: ["inventories"] })
    } catch {
      toast.error("Delete failed")
    }
  }

  const handleEdit = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setIsEditModalOpen(true)
  }

  const handleAddVariant = (product: Product) => {
    setSelectedProductForVariant({
      uuid: product.uuid,
      name: product.name,
    })
    setIsAddVariantModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
                <p className="text-slate-600 mt-1">Manage your products and variants</p>
              </div>
            </div>
            <button
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Inventory
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, categories, variants, or SKUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 text-lg">Loading inventory...</p>
              </div>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-600 mb-6">Get started by adding your first product to inventory</p>
                <button
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add First Product
                </button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your search terms or clear the search to see all products
                </p>
                <button
                  className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* Table Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-3">Category</div>
                  <div className="col-span-2">Variants</div>
                  <div className="col-span-2">Status</div>
                </div>
              </div>

              {/* Search Results Indicator */}
              {searchTerm && (
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-700">
                      Showing <span className="font-semibold">{filteredProducts.length}</span> results for "
                      <span className="font-semibold">{searchTerm}</span>"
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear search
                    </button>
                  </div>
                </div>
              )}

              {/* Table Body */}
              <div className="divide-y divide-slate-200">
                {filteredProducts.map((product) => (
                  <React.Fragment key={product.uuid}>
                    {/* Product Row */}
                    <div
                      className="cursor-pointer hover:bg-slate-50 transition-colors duration-150"
                      onClick={() => toggleExpand(product.uuid)}
                    >
                      <div className="px-6 py-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-5 flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {expandedProducts.has(product.uuid) ? (
                                <ChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-200" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-slate-400 transition-transform duration-200" />
                              )}
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-slate-100 rounded-lg">
                                <Package className="h-5 w-5 text-slate-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                                <p className="text-sm text-slate-500">Product ID: {product.uuid.slice(0, 8)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-3">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-slate-400" />
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                              <Hash className="h-4 w-4 text-slate-400" />
                              <span className="text-lg font-semibold text-slate-900">{product.variants.length}</span>
                              <span className="text-sm text-slate-500">variants</span>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Variants */}
                    {expandedProducts.has(product.uuid) && (
                      <div className="bg-slate-50 border-t border-slate-200">
                        <div className="px-6 py-4">
                          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Variants Header */}
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                                Product Variants
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAddVariant(product)
                                }}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                title="Add new variant"
                              >
                                <Plus className="h-4 w-4" />
                                <span>Add Variant</span>
                              </button>
                            </div>

                            {/* Variants List */}
                            <div className="divide-y divide-slate-200">
                              {product.variants.map((variant) => (
                                <div key={variant.uuid} className="px-4 py-4 hover:bg-slate-50 transition-colors">
                                  <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-3">
                                      <div className="font-medium text-slate-900">{variant.variant_name}</div>
                                    </div>
                                    <div className="col-span-2">
                                      <div className="text-sm text-slate-600">
                                        <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">
                                          {variant.sku}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-span-2">
                                      <div className="text-lg font-semibold text-slate-900">${variant.price}</div>
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
                                        <span className="font-semibold text-slate-900">{variant.quantity}</span>
                                        <span className="text-sm text-slate-500">in stock</span>
                                      </div>
                                    </div>
                                    <div className="col-span-3 flex items-center justify-end space-x-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEdit(variant)
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit variant"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDelete(variant.uuid)
                                        }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          )}
        </div>
      </div>

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
        productUuid={selectedProductForVariant?.uuid || null}
        productName={selectedProductForVariant?.name}
      />
    </div>
  )
}

export default InventoryPage
