"use client"

import type React from "react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X, Package, Tag, DollarSign, Hash, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import Portal from "../ui/Portal"

interface AddInventoryModalProps {
  open: boolean
  onClose: () => void
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    variant_name: "",
    price: 0,
    quantity: 0,
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/products/add-product/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          variant: {
            variant_name: formData.variant_name,
            price: formData.price,
            quantity: formData.quantity,
          },
        }),
      })
      if (!res.ok) throw new Error("Failed to create product")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] })
      toast.success("Product with variant added")
      handleClose()
    },
    onError: () => {
      toast.error("Failed to add inventory")
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, category, variant_name, price, quantity } = formData
    if (!name || !category || !variant_name || !price || !quantity) {
      toast.error("All fields are required")
      return
    }
    mutation.mutate()
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
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
                <p className="text-sm text-slate-600">Create a product with its first variant</p>
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
              {/* Product Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-900">Product Information</h3>
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Package className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-500"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 bg-white appearance-none"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Engine">Engine</option>
                      <option value="Fluids">Fluids</option>
                      <option value="Filters">Filters</option>
                      <option value="Brakes">Brakes</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Tires">Tires</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Hair Care">Hair Care</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

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
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900 placeholder-slate-500"
                      placeholder="e.g., Small, Medium, Red, 500ml"
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
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900"
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
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-900"
                        placeholder="0"
                        min={0}
                        required
                      />
                    </div>
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
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4" />
                    <span>Add Product</span>
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
