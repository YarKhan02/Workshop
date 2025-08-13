import type { CreateInvoicePayload } from "../types/billing"

export function transformToSnakeCase(data: CreateInvoicePayload): any {
  return {
    customer_id: data.customerId,
    subtotal: data.subtotal,
    tax: data.taxAmount,           // Frontend field -> backend maps to tax_percentage
    discount: data.discountAmount, // Frontend field -> backend maps to discount_amount  
    grand_total: data.totalAmount, // Frontend field -> backend maps to total_amount
    status: data.status,
    items: data.items.map((item: { variantId: string; quantity: number; unitPrice?: number; totalPrice: number }) => ({
        product_variant: item.variantId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
    })),
  }
}
