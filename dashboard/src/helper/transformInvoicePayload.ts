import type { CreateInvoicePayload } from "../types/billing"

export function transformToSnakeCase(data: CreateInvoicePayload): any {
  return {
    subtotal: data.subtotal,
    discount: data.discountAmount, // Frontend field -> backend maps to discount_amount  
    grand_total: data.totalAmount, // Frontend field -> backend maps to total_amount
    status: data.status,
    items: data.items.map((item: { variantId: string; quantity: number | ""; unitPrice?: number; totalPrice: number }) => ({
        product_variant: item.variantId,
        quantity: Number(item.quantity) || 0,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
    })),
  }
}
