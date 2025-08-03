import type { CreateInvoicePayload } from "../types"

export function transformToSnakeCase(data: CreateInvoicePayload): any {
  return {
    customer_id: data.customerId,
    total_amount: data.subtotal,
    tax: data.taxAmount,
    discount: data.discountAmount,
    grand_total: data.totalAmount,
    status: data.status,
    due_date: data.dueDate,
    is_active: data.isActive,
    items: data.items.map((item: { variantId: any; quantity: any; unitPrice: any; totalPrice: any }) => ({
        product_variant: item.variantId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
    })),
  }
}
