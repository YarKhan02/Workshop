"use client"

import type React from "react"
import { useState } from "react"
import { Package, Tag, Banknote, Hash, Loader2 } from "lucide-react"
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from "../../ui"
import { useCreateProduct } from "../../../hooks/useInventory"
import type { AddInventoryModalProps, ProductFormData } from "../../../types/inventory"

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ open, onClose }) => {
  const { theme } = useTheme();
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
    <ThemedModal
      isOpen={open}
      onClose={handleClose}
      title="Add New Product"
      subtitle="Create a new product with its first variant"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>Product Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="space-y-2">
              <label className={cn("block text-sm font-semibold", theme.textSecondary)}>
                Product Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className={cn("h-5 w-5", theme.textSecondary)} />
                </div>
                <ThemedInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Enter product name"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className={cn("block text-sm font-semibold", theme.textSecondary)}>
                Category <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className={cn("h-5 w-5", theme.textSecondary)} />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={cn("w-full pl-10 pr-10 py-3 border rounded-xl transition-colors appearance-none", theme.background, theme.textPrimary, theme.border)}
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
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className={cn("h-5 w-5", theme.textSecondary)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>Initial Variant Details</h3>
          </div>

          {/* Variant Name */}
          <div className="space-y-2">
            <label className={cn("block text-sm font-semibold", theme.textSecondary)}>
              Variant Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className={cn("h-5 w-5", theme.textSecondary)} />
              </div>
              <ThemedInput
                type="text"
                name="variant_name"
                value={formData.variant_name}
                onChange={handleChange}
                className="pl-10"
                placeholder="e.g., Standard, Premium, 1L Bottle"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-2">
              <label className={cn("block text-sm font-semibold", theme.textSecondary)}>
                Price <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Banknote className={cn("h-5 w-5", theme.textSecondary)} />
                </div>
                <ThemedInput
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="0.00"
                  min={0}
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className={cn("block text-sm font-semibold", theme.textSecondary)}>
                Initial Quantity <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className={cn("h-5 w-5", theme.textSecondary)} />
                </div>
                <ThemedInput
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="pl-10"
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

        {/* Form Actions */}
        <div className={cn("flex items-center justify-end space-x-3 pt-6 border-t", theme.border)}>
          <ThemedButton
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={createProductMutation.isPending}
          >
            Cancel
          </ThemedButton>
          <ThemedButton
            type="submit"
            variant="primary"
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
          </ThemedButton>
        </div>
      </form>
    </ThemedModal>
  )
}

export default AddInventoryModal
