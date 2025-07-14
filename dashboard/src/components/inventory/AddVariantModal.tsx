"use client"

import type React from "react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X, Plus, DollarSign, Hash, Loader2, Tag } from "lucide-react"
import toast from "react-hot-toast"
import Portal from "../ui/Portal"

interface AddVariantModalProps {
  open: boolean
  onClose: () => void
  productUuid: string | null
  productName?: string
}

const AddVariantModal: React.FC<AddVariantModalProps> = ({ open, onClose, productUuid, productName }) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    variant_name: "",
    price: 0,
    quantity: 0,
  })

  const mutation = useMutation({
    mutationFn: async (data: { variant_name: string; price: number; quantity: number }) => {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:8000/variants/${productUuid}/add-variant/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        throw new Error("Failed to add variant")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
      toast.success("New variant added successfully")
      handleClose()
    },
    onError: () => {
      toast.error("Failed to add variant")
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { variant_name, price, quantity } = formData
    if (!variant_name || price < 0 || quantity < 0) {
      toast.error("All fields are required and must be positive")
      return
    }
    mutation.mutate(formData)
  }

  const handleClose = () => {
    setFormData({ variant_name: "", price: 0, quantity: 0 })
    onClose()
  }

  if (!open || !productUuid) return null

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Plus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add New Variant</h2>
                <p className="text-sm text-slate-600">
                  {productName ? `Add variant to "${productName}"` : "Create a new product variant"}
                </p>
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
              {/* Product Info Display */}
              {productName && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Adding variant to:</span>
                    <span className="text-sm font-semibold text-slate-900">{productName}</span>
                  </div>
                </div>
              )}

              {/* Variant Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-green-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-900">Variant Details</h3>
                </div>

                {/* Variant Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Variant Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="variant_name"
                      value={formData.variant_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-slate-900 placeholder-slate-500"
                      placeholder="e.g., Large, Blue, 500ml, XL"
                      required
                    />
                  </div>
                </div>

                {/* Price and Quantity Row */}
                <div className="grid grid-cols-2 gap-4">
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
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-slate-900"
                        placeholder="0.00"
                        min={0}
                        step="0.01"
                        required
                      />
                    </div>
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
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-slate-900"
                        placeholder="0"
                        min={0}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Level Preview */}
                {formData.quantity > 0 && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-700">Stock Level Preview</span>
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
                )}
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
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adding Variant...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Add Variant</span>
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
