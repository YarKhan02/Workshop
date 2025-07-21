import toast from "react-hot-toast"
import type { CreateInvoicePayload } from "../types"
import { transformToSnakeCase } from "../helper/transformInvoicePayload"

export async function createInvoice(invoiceData: CreateInvoicePayload): Promise<any> {
  const payload = transformToSnakeCase(invoiceData)
  const token = localStorage.getItem("token")
  if (!token) {
    toast.error("Authentication token not found. Please log in.")
    throw new Error("Authentication token not found.")
  }

  const res = await fetch("http://localhost:8000/invoices/add-invoice/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Unknown error" }))
    console.error("Backend error response:", errorData)
    throw new Error(errorData.message || `Failed to create invoice: ${res.statusText}`)
  }

  return res.json()
}