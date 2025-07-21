"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X, Edit3, DollarSign, Hash, Loader2, Save } from "lucide-react"
import toast from "react-hot-toast"
import Portal from "../ui/Portal"

interface EditInventoryModalProps {
  open: boolean
  onClose: () => void
  inventory: {
    id: string
    price: number
    quantity: number
  } | null
}

const EditInventoryModal: React.FC<EditInventoryModalProps> = ({ open, onClose, inventory }) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    price: 0,
    quantity: 0,
  })

  useEffect(() => {
    if (inventory) {
      setFormData({
        price: inventory.price,
        quantity: inventory.quantity,
      })
    }
  }, [inventory])

  const mutation = useMutation({
    mutationFn: async (data: { price: number; quantity: number }) => {
      const res = await fetch(`http://localhost:8000/variants/${inventory!.id}/update-variant/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        throw new Error("Failed to update inventory")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
      toast.success("Inventory updated successfully")
      handleClose()
    },
    onError: () => {
      toast.error("Failed to update inventory")
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.price < 0 || formData.quantity < 0) {
      toast.error("Price and quantity must be positive")
      return
    }
    mutation.mutate(formData)
  }

  const handleClose = () => {
    setFormData({ price: 0, quantity: 0 })
    onClose()
  }

  if (!open || !inventory) return null

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Edit3 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Update Inventory</h2>
                <p className="text-sm text-slate-600">Modify price and quantity for this variant</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Current Values Display */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Current Values</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">Price:</span>
                    <span className="font-semibold text-slate-900">${inventory.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-600">Quantity:</span>
                    <span className="font-semibold text-slate-900">{inventory.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-900">New Values</h3>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-slate-900"
                      placeholder="0.00"
                      min={0}
                      step="0.01"
                      required
                    />
                  </div>
                  {formData.price !== inventory.price && (
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-orange-600">
                        Change: ${inventory.price} → ${formData.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-slate-900"
                      placeholder="0"
                      min={0}
                      required
                    />
                  </div>
                  {formData.quantity !== inventory.quantity && (
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-orange-600">
                        Change: {inventory.quantity} → {formData.quantity}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Level Indicator */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Stock Level</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        formData.quantity > 10 ? "bg-green-400" : formData.quantity > 0 ? "bg-yellow-400" : "bg-red-400"
                      }`}
                    ></div>
                    <span
                      className={`text-sm font-semibold ${
                        formData.quantity > 10
                          ? "text-green-700"
                          : formData.quantity > 0
                            ? "text-yellow-700"
                            : "text-red-700"
                      }`}
                    >
                      {formData.quantity > 10 ? "Good Stock" : formData.quantity > 0 ? "Low Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors"
                disabled={mutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
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

export default EditInventoryModal
