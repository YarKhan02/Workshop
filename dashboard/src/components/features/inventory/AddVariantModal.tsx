"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Banknote, Hash, Loader2, Tag } from "lucide-react"
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from "../../ui"
import { useCreateVariant } from "../../../hooks/useInventory"
import type { AddVariantModalProps, ProductVariantFormData } from "../../../types/inventory"

const AddVariantModal: React.FC<AddVariantModalProps> = ({ open, onClose, productId, productName }) => {
  const { theme } = useTheme();
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
    <ThemedModal
      isOpen={open}
      onClose={handleClose}
      title="Add New Variant"
      subtitle={productName ? `Add variant to "${productName}"` : "Create a new product variant"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info Display */}
        {productName && (
          <div className={cn("rounded-xl p-4 border", theme.backgroundSecondary, theme.border)}>
            <div className="flex items-center space-x-2">
              <Tag className={cn("h-4 w-4", theme.textSecondary)} />
              <span className={cn("text-sm font-medium", theme.textSecondary)}>Adding variant to:</span>
              <span className={cn("text-sm font-semibold", theme.textPrimary)}>{productName}</span>
            </div>
          </div>
        )}

              {/* Variant Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                  <h3 className={cn("text-lg font-semibold", theme.textPrimary)}>Variant Details</h3>
                </div>

                {/* Variant Name */}
                <ThemedInput
                  label="Variant Name"
                  type="text"
                  name="variant_name"
                  value={formData.variant_name}
                  onChange={handleChange}
                  placeholder="e.g., Premium, Large, 2L Bottle"
                  leftIcon={<Tag className="h-5 w-5" />}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <ThemedInput
                    label="Price"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    leftIcon={<Banknote className="h-5 w-5" />}
                    min={0}
                    step="0.01"
                    required
                  />

                  {/* Quantity */}
                  <ThemedInput
                    label="Quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    leftIcon={<Hash className="h-5 w-5" />}
                    min={0}
                    required
                  />
                </div>

                {/* Stock Level Preview */}
                {formData.quantity > 0 && (
                  <div className={cn("rounded-xl p-4 border", theme.backgroundSecondary, theme.border)}>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-sm font-medium", theme.textSecondary)}>Stock Level Preview</span>
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

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t mt-6">
          <ThemedButton
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={createVariantMutation.isPending}
          >
            Cancel
          </ThemedButton>
          <ThemedButton
            type="submit"
            variant="primary"
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
          </ThemedButton>
        </div>
      </form>
    </ThemedModal>
  )
}

export default AddVariantModal
