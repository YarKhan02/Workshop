"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Edit3, Banknote, Hash, Loader2, Save } from "lucide-react"
import { useTheme, cn, ThemedModal, ThemedInput, ThemedButton } from "../../ui"
import { useUpdateVariant } from "../../../hooks/useInventory"
import type { EditInventoryModalProps, ProductVariantUpdateData } from "../../../types/inventory"

const EditInventoryModal: React.FC<EditInventoryModalProps> = ({ open, onClose, inventory }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<ProductVariantUpdateData>({
    price: 0,
    quantity: 0,
  })

  const updateVariantMutation = useUpdateVariant()

  useEffect(() => {
    if (inventory) {
      setFormData({
        price: inventory.price,
        quantity: inventory.quantity,
      })
    }
  }, [inventory])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: ProductVariantUpdateData) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inventory || formData.price < 0 || formData.quantity < 0) {
      return
    }

    updateVariantMutation.mutate(
      {
        variantId: inventory.id,
        variantData: formData,
      },
      {
        onSuccess: () => {
          handleClose()
        }
      }
    )
  }

  const handleClose = () => {
    setFormData({ price: 0, quantity: 0 })
    onClose()
  }

  if (!open || !inventory) return null

  return (
    <ThemedModal
      isOpen={open}
      onClose={handleClose}
      title="Edit Variant"
      subtitle="Update variant price and quantity"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
              Quantity <span className="text-red-400">*</span>
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
        <div className={cn("rounded-xl p-4 border", theme.backgroundSecondary, theme.border)}>
          <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Stock Level Preview</span>
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

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t mt-6">
          <ThemedButton
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={updateVariantMutation.isPending}
          >
            Cancel
          </ThemedButton>
          <ThemedButton
            type="submit"
            variant="primary"
            disabled={updateVariantMutation.isPending}
          >
            {updateVariantMutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Variant
              </>
            )}
          </ThemedButton>
        </div>
      </form>
    </ThemedModal>
  )
}

export default EditInventoryModal
