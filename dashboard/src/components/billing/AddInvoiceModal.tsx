"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { X, Trash2, Loader2, Package } from "lucide-react"
import { createInvoice } from "../../api/billing"
import Portal from "../ui/Portal"
import type { CustomerInvoice, Product, ProductVariant, InvoiceItem } from "../../types"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Search } from "lucide-react" // Declared Search variable

// Extended InvoiceItem to include product variant details
interface InvoiceItemWithProduct
  extends Omit<InvoiceItem, "id" | "invoiceId" | "isActive" | "createdAt" | "updatedAt"> {
  variantId?: string // ID for the product variant, if applicable
  productName?: string // Name of the product, if applicable
  variantName?: string // Name of the variant, if applicable
  sku?: string // SKU of the variant, if applicable
}

interface AddInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  customers: CustomerInvoice[] // This prop is now unused as customers are fetched internally
  jobs: null // Keeping this as null as per previous code
}

const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({ isOpen, onClose, onSuccess, jobs }) => {
  const [token] = useState(localStorage.getItem("token") || "")
  const [formData, setFormData] = useState({
    customerId: "",
    jobId: "",
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    status: "draft" as "draft" | "pending" | "paid" | "overdue" | "cancelled" | "partial",
    dueDate: "",
    notes: "",
    terms: "",
  })
  // Start with an empty array for items, as custom items are no longer added by default
  const [items, setItems] = useState<InvoiceItemWithProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [showProductSelector, setShowProductSelector] = useState(false)

  // Fetch Customers
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery<CustomerInvoice[]>({
    queryKey: ["invoice-customers", customerSearchTerm],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/customers/customer-invoices/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch customers")
      return res.json()
    },
    enabled: !!token,
  })

  // Effect to reset customerId if selected customer is no longer in filtered list
  useEffect(() => {
    if (customersData && formData.customerId) {
      // Check if the currently selected customer ID exists in the new filtered list
      const isSelectedCustomerStillAvailable = customersData.some((customer) => customer.id === formData.customerId)
      if (!isSelectedCustomerStillAvailable) {
        setFormData((prev) => ({ ...prev, customerId: "" }))
      }
    }
  }, [customersData, formData.customerId])

  // Fetch Products and their Variants
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["invoice-products", productSearchTerm],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/products/details/?search=${productSearchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch products")
      return res.json()
    },
    enabled: !!token,
  })

  // Flatten products into a list of variants for selection
  const availableVariants = useMemo(() => {
    if (!products) return []
    return products.flatMap((product) =>
      product.variants.map((variant) => ({
        ...variant,
        productName: product.name,
        productUuid: product.id,
      })),
    )
  }, [products])

  // Effect to set due date to today when status is "paid"
  useEffect(() => {
    if (formData.status === "paid") {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")
      setFormData((prev) => ({ ...prev, dueDate: `${year}-${month}-${day}` }))
    }
  }, [formData.status])

  useEffect(() => {
    calculateTotals()
  }, [items, formData.discountAmount]) // Recalculate when items or discount changes

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.customerId) {
      newErrors.customerId = "Customer is required"
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    }
    if (items.length === 0) {
      newErrors.items = "At least one invoice item is required."
    }
    // Only validate total amount if there are items
    if (items.length > 0 && formData.totalAmount <= 0) {
      newErrors.totalAmount = "Total amount must be greater than 0"
    }
    // Validate items
    items.forEach((item, index) => {
      if (item.quantity <= 0) {
        newErrors[`item${index}Quantity`] = "Quantity must be greater than 0"
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => {
      // Ensure item.totalPrice is a finite number, default to 0 if not
      const itemTotalPrice = Number.isFinite(item.totalPrice) ? item.totalPrice : 0
      return sum + itemTotalPrice
    }, 0)
    const taxAmount = subtotal * 0.1 // 10% tax
    const discountAmount = Number.isFinite(formData.discountAmount) ? formData.discountAmount : 0
    const totalAmount = subtotal + taxAmount - discountAmount
    setFormData((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount,
    }))
  }

  const updateItem = (index: number, field: keyof InvoiceItemWithProduct, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    // Calculate total price for this item
    if (field === "quantity" || field === "unitPrice") {
      const qty = Number(newItems[index].quantity) // Ensure it's a number
      const price = Number(newItems[index].unitPrice) // Ensure it's a number
      newItems[index].totalPrice = Number.isFinite(qty) && Number.isFinite(price) ? qty * price : 0
    }
    setItems(newItems)
  }

  const addProductVariantToInvoice = (variant: ProductVariant & { productName: string }) => {
    
    const newItem: InvoiceItemWithProduct = {
      description: `${variant.productName} - ${variant.variant_name}`,
      quantity: 1,
      unitPrice: Number(variant.price), // Ensure price is a number
      totalPrice: Number(variant.price), // quantity is 1 initially, ensure price is number
      variantId: variant.id,
      productName: variant.productName,
      variantName: variant.variant_name,
      sku: variant.sku,
    }
    setItems((prevItems) => {
      // Check if this variant is already in the cart
      const existingItemIndex = prevItems.findIndex((item) => item.variantId === newItem.variantId)

      if (existingItemIndex > -1) {
        // If it exists, update quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += 1
        updatedItems[existingItemIndex].totalPrice =
          updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unitPrice
        toast.success(`Increased quantity for ${newItem.description}`)
        return updatedItems
      } else {
        // Otherwise, add new item
        toast.success(`Added ${newItem.description} to invoice`)
        return [...prevItems, newItem]
      }
    })
    setShowProductSelector(false) // Close product selector after adding
    setProductSearchTerm("") // Clear search term
  }

  const removeItem = (index: number) => {
    // Allow removing an item only if there's more than one item left
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index)
      setItems(newItems)
    } else {
      toast.error("An invoice must have at least one item.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please correct the errors in the form.")
      return
    }
    setLoading(true)
    try {
      const invoiceData = {
        ...formData,
        customerId: formData.customerId, // Already UUID string
        jobId: formData.jobId || undefined, // Keep as string or convert if backend expects int
        invoiceNumber: "", // Will be generated by backend
        isActive: true,
        items: items
          .filter((item) => item.variantId) // Ensure variantId is not undefined
          .map((item) => ({
            variantId: item.variantId as string, // Cast variantId to string
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
      }
      const result = await createInvoice(invoiceData)
      toast.success("Invoice created successfully!")
      onSuccess()
      handleClose()
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast.error("Failed to create invoice. Please check the console for details.")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    // Ensure amount is a finite number before formatting
    const validAmount = Number.isFinite(amount) ? amount : 0
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(validAmount)
  }

  const handleClose = () => {
    setFormData({
      customerId: "",
      jobId: "",
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
      status: "draft",
      dueDate: "",
      notes: "",
      terms: "",
    })
    setItems([]) // Reset items to empty
    setErrors({})
    setCustomerSearchTerm("")
    setProductSearchTerm("")
    setShowProductSelector(false)
    onClose()
  }

  const selectedCustomer = useMemo(() => {
    return customersData?.find((customer) => customer.id === formData.customerId)
  }, [customersData, formData.customerId])

  if (!isOpen) return null

  return (
    <Portal>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Create New Invoice</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {isLoadingCustomers ? (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      <span className="ml-2 text-gray-600">Loading customers...</span>
                    </div>
                  ) : (
                    <select
                      name="customerId"
                      value={formData.customerId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customerId: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none ${
                        errors.customerId ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select customer...</option>
                      {customersData?.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.first_name} {customer.last_name} - {customer.email}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>}
              </div>
              {/* <div>                <label className="block text-sm font-medium text-gray-700 mb-2">Job (Optional)</label> */}
              {/* <select                  value={formData.jobId}                  onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"                >                  <option value="">Select Job</option>                  {jobs.map((job) => (                    <option key={job.id} value={job.id}>                      Job #{job.id} - {job.jobType.replace('_', ' ')}                    </option>                  ))}                </select> */}
              {/* </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dueDate ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={formData.status === "paid"} // Disable if status is 'paid'
                />
                {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
                <button
                  type="button"
                  onClick={() => setShowProductSelector(!showProductSelector)}
                  className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Add Product
                </button>
              </div>

              {/* Product Selector */}
              {showProductSelector && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products or variants..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {isLoadingProducts ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      <span className="ml-2 text-gray-600">Loading products...</span>
                    </div>
                  ) : availableVariants.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No products found.</p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {availableVariants.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {variant.productName} - {variant.variant_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              SKU: {variant.sku} | Price: {formatCurrency(variant.price)} | Stock: {variant.quantity}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addProductVariantToInvoice(variant)}
                            disabled={variant.quantity === 0}
                            className="ml-4 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {items.length === 0 && !showProductSelector ? (
                  <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                    <p className="mb-2">No items added yet.</p>
                    <p>Click "Add Product" to start adding items to this invoice.</p>
                  </div>
                ) : (
                  items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`item${index}Description`] ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Service description"
                          readOnly={!!item.variantId} // Make read-only if it's a product variant
                        />
                        {errors[`item${index}Description`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`item${index}Description`]}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`item${index}Quantity`] ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors[`item${index}Quantity`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`item${index}Quantity`]}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors[`item${index}UnitPrice`] ? "border-red-500" : "border-gray-300"
                          }`}
                          readOnly={!!item.variantId} // Make read-only if it's a product variant
                        />
                        {errors[`item${index}UnitPrice`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`item${index}UnitPrice`]}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                        <input
                          type="text"
                          value={formatCurrency(item.totalPrice)}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1} // Disable if only one item left
                          className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items}</p>}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-6">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%):</span>
                    <span className="font-medium">{formatCurrency(formData.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discountAmount}
                      onChange={(e) => {
                        const discount = Number.parseFloat(e.target.value) || 0
                        setFormData({
                          ...formData,
                          discountAmount: discount,
                        })
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                    />
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-semibold">{formatCurrency(formData.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes..."
                />
              </div> */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Payment terms and conditions..."
                />
              </div> */}
            {/* </div> */}

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Invoice"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  )
}

export default AddInvoiceModal
