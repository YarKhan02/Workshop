"use client"

import type React from "react"
import { useState } from "react"
import { X, Package, Tag, Banknote, Hash, Loader2 } from "lucide-react"
import Portal from "../../shared/utility/Portal"
import { useCreateProduct } from "../../../hooks/useInventory"
import type { AddInventoryModalProps, ProductFormData } from "../../../types/inventory"

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    variant_name: "",
    price: 0,
    quantity: 0,
  })

  const createProductMutation = useCreateProduct()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: ProductFormData) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, category, variant_name, price, quantity } = formData
    
    if (!name || !category || !variant_name || price < 0 || quantity < 0) {
      return
    }

    const productData = {
      name,
      category,
      variant: {
        variant_name,
        price,
        quantity,
      },
    }

    createProductMutation.mutate(productData, {
      onSuccess: () => {
        handleClose()
      }
    })
  }

  const handleClose = () => {
    setFormData({
      name: "",
      category: "",
      variant_name: "",
      price: 0,
      quantity: 0,
    })
    onClose()
  }

  if (!open) return null

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="bg-gradient-to-br from-gray-800/95 to-slate-800/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-xl border border-orange-500/30">
                <Package className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">Add New Product</h2>
                <p className="text-sm text-gray-400">Create a new product with its first variant</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Product Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-100">Product Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Product Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-100 placeholder-gray-400"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-100 appearance-none"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Engine">Engine</option>
                        <option value="Exterior">Exterior</option>
                        <option value="Interior">Interior</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Tires">Tires</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Hair Care">Hair Care</option>
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Variant Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-100">Initial Variant Details</h3>
                </div>

                {/* Variant Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300">
                    Variant Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="variant_name"
                      value={formData.variant_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-100 placeholder-gray-400"
                      placeholder="e.g., Standard, Premium, 1L Bottle"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Price <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Banknote className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-100 placeholder-gray-400"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Initial Quantity <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-100 placeholder-gray-400"
                        placeholder="0"
                        min={0}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Level Preview */}
                {formData.quantity > 0 && (
                  <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-400">Stock Level Preview</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.quantity > 10
                              ? "bg-green-400"
                              : formData.quantity > 0
                                ? "bg-yellow-400"
                                : "bg-red-400"
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-semibold ${
                            formData.quantity > 10
                              ? "text-green-400"
                              : formData.quantity > 0
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {formData.quantity > 10 ? "Good Stock" : formData.quantity > 0 ? "Low Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700/50 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-600/50 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-colors font-medium"
                disabled={createProductMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  )
}

export default AddInventoryModal
