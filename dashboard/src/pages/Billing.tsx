"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Eye,
  Trash2,
  DollarSign,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Package,
  User,
} from "lucide-react"
import toast from "react-hot-toast"
import AddInvoiceModal from "../components/billing/AddInvoiceModal"
import type { Job, Order, BillingStats, CustomerInvoice } from "../types"

// Updated interfaces to match backend data

const Billing: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<BillingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [customers, setCustomers] = useState<CustomerInvoice[]>([])
  const [jobs, setJobs] = useState<Job[]>([])

  const fetchOrders = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token found.")

      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter) params.append("status", statusFilter)
      params.append("page", currentPage.toString())

      const response = await fetch(`http://localhost:8000/invoices/list-invoices/?${params.toString()}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorMsg = errorData?.detail || `Failed with status ${response.status}`
        throw new Error(errorMsg)
      }

      const data = await response.json()
      const ordersData = Array.isArray(data) ? data : data.orders || []
      const paginationData = data.pagination || {}

      setOrders(ordersData)
      setTotalPages(paginationData.totalPages || 1)
      setTotalItems(paginationData.totalItems || ordersData.length)
    } catch (error: any) {
      console.error("Error fetching orders:", error.message || error)
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8000/orders/stats/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch stats")

      const data = await response.json()
      setStats(data.stats || data)
    } catch (error) {
      console.error("Error fetching billing stats:", error)
      // Set default stats if API fails
      setStats({
        totalRevenue: 0,
        totalOrders: orders.length,
        outstandingAmount: 0,
        monthlyRevenue: 0,
      })
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [searchTerm, statusFilter, currentPage])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:8000/orders/${id}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to delete order")

        fetchOrders()
        fetchStats()
      } catch (error) {
        console.error("Error deleting order:", error)
      }
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8000/orders/${id}/status/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update order status")

      fetchOrders()
      fetchStats()
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "partially_paid":
        return "text-blue-600 bg-blue-100"
      case "overdue":
        return "text-red-600 bg-red-100"
      case "cancelled":
        return "text-gray-600 bg-gray-100"
      default:
        return "text-slate-600 bg-slate-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "partially_paid":
        return <DollarSign className="w-4 h-4" />
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const handleAddInvoiceSuccess = () => {
    setShowAddModal(false)
    fetchOrders()
    fetchStats()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Finance HQ
                </h1>
                <p className="text-gray-400 mt-1">Manage orders, payments, and elite billing</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Order
            </button>

            <AddInvoiceModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onSuccess={handleAddInvoiceSuccess}
              customers={customers}
              jobs={null}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Outstanding</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.outstandingAmount)}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.monthlyRevenue)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders by customer name, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600 text-lg">Loading orders...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
                <p className="text-slate-600">No orders match your current filters</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  <div className="col-span-2">Order ID</div>
                  <div className="col-span-3">Customer</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <div key={order.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2">
                        <span className="font-mono text-sm text-slate-900">#{order.id.slice(0, 8)}</span>
                      </div>

                      <div className="col-span-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <User className="h-4 w-4 text-slate-600" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {order.customer.first_name} {order.customer.last_name}
                            </div>
                            <div className="text-sm text-slate-500">{order.customer.email}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="font-semibold text-slate-900">{formatCurrency(order.total_amount)}</div>
                        <div className="text-sm text-slate-500">{order.items.length} items</div>
                      </div>

                      <div className="col-span-2">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {formatStatus(order.status)}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <div className="text-sm text-slate-600">{formatDate(order.created_at)}</div>
                      </div>

                      <div className="col-span-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowDetailModal(true)
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-600">
                      Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems}{" "}
                      orders
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Order Detail Modal */}
        {showDetailModal && selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => {
              setShowDetailModal(false)
              setSelectedOrder(null)
            }}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  )
}

// Order Detail Modal Component
const OrderDetailModal: React.FC<{
  order: Order
  onClose: () => void
  onStatusUpdate: (id: string, status: string) => void
}> = ({ order, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(order.status)

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numAmount)
  }

  const handleStatusUpdate = () => {
    if (newStatus !== order.status) {
      onStatusUpdate(order.id, newStatus)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
              <p className="text-sm text-slate-600">#{order.id.slice(0, 8)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Name:</span>
                <span className="ml-2 font-medium text-slate-900">
                  {order.customer.first_name} {order.customer.last_name}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Email:</span>
                <span className="ml-2 font-medium text-slate-900">{order.customer.email}</span>
              </div>
              <div>
                <span className="text-slate-600">Phone:</span>
                <span className="ml-2 font-medium text-slate-900">{order.customer.phone_number}</span>
              </div>
              <div>
                <span className="text-slate-600">Order Date:</span>
                <span className="ml-2 font-medium text-slate-900">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Package className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {item.product_name} - {item.product_variant} {/* Display product and variant name */}
                      </div>
                      <div className="text-sm text-slate-600">
                        {item.quantity} × {formatCurrency(item.unit_price)}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-slate-900">{formatCurrency(item.total_price)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(
                    order.items.reduce((sum, item) => sum + Number.parseFloat(item.total_price), 0).toString(),
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Discount:</span>
                <span className="font-medium text-slate-900">-{formatCurrency(order.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax:</span>
                <span className="font-medium text-slate-900">{formatCurrency(order.tax)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-lg font-bold">
                <span className="text-slate-900">Total:</span>
                <span className="text-green-600">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Update Status</h3>
            <div className="flex items-center space-x-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={newStatus === order.status}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing