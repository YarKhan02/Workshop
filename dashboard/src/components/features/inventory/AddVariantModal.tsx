"use client"

import type React from "react"
import { useState } from "react"
import { X, Plus, Banknote, Hash, Loader2, Tag } from "lucide-react"
import Portal from "../../shared/utility/Portal"
import { useCreateVariant } from "../../../hooks/useInventory"
import type { AddVariantModalProps, ProductVariantFormData } from "../../../types/inventory"

const AddVariantModal: React.FC<AddVariantModalProps> = ({ open, onClose, productId, productName }) => {
  const [formData, setFormData] = useState<ProductVariantFormData>({
    variant_name: "",
    price: 0,
    quantity: 0,
  })

  const createVariantMutation = useCreateVariant()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: ProductVariantFormData) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { variant_name, price, quantity } = formData
    
    if (!variant_name || price < 0 || quantity < 0 || !productId) {
      return
    }

    createVariantMutation.mutate(
      {
        productId,
        variantData: {
          variant_name,
          price,
          quantity,
        },
      },
      {
        onSuccess: () => {
          handleClose()
        }
      }
    )
  }

  const handleClose = () => {
    setFormData({ variant_name: "", price: 0, quantity: 0 })
    onClose()
  }

  if (!open || !productId) return null

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="bg-gradient-to-br from-gray-800/95 to-slate-800/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                <Plus className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">Add New Variant</h2>
                <p className="text-sm text-gray-400">
                  {productName ? `Add variant to "${productName}"` : "Create a new product variant"}
                </p>
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
              {/* Product Info Display */}
              {productName && (
                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">Adding variant to:</span>
                    <span className="text-sm font-semibold text-gray-100">{productName}</span>
                  </div>
                </div>
              )}

              {/* Variant Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-100">Variant Details</h3>
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
                      placeholder="e.g., Premium, Large, 2L Bottle"
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
                      Quantity <span className="text-red-400">*</span>
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
                          {formData.quantity > 10
                            ? "Good Stock"
                            : formData.quantity > 0
                              ? "Low Stock"
                              : "Out of Stock"}
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
                disabled={createVariantMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createVariantMutation.isPending}
              >
                {createVariantMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant
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

export default AddVariantModal
