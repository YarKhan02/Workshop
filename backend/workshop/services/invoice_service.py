# services/invoice_service.py
from typing import Dict, Any, Optional
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import json
from workshop.queries.combined_invoice_queries import (
    get_optimized_inventory_invoices, 
    get_optimized_booking_invoices,
    get_all_invoices_combined
)
from workshop.queries.invoice_queries import get_filtered_invoices, get_billing_statistics, get_invoice_booking_data
from workshop.models.invoice import Invoice
from workshop.serializers.invoice_serializer import InvoiceCreateSerializer, InvoiceSerializer
from workshop.serializers.invoice_booking_serializer import InvoiceBookingSerializer
from workshop.serializers.combined_invoice_serializer import (
    InventoryInvoiceSerializer,
    BookingInvoiceSerializer,
    CombinedInvoiceSerializer
)
from .base_service import BaseService


class InvoiceService(BaseService):

    # Get Invoices
    @staticmethod
    def get_invoices_paginated(customer_id=None, invoice_type=None, page=1, page_size=10, date_from=None, date_to=None):
        print(f"Fetching invoices for customer_id={customer_id}, invoice_type={invoice_type}, date_from={date_from}, date_to={date_to}, page={page}, page_size={page_size}")
        try:
            result = get_filtered_invoices(
                customer_id=customer_id,
                invoice_type=invoice_type,
                page=page,
                page_size=page_size,
                date_from=date_from,
                date_to=date_to
            )
            print(result)
        except Exception as e:
            import traceback
            print("Error in get_filtered_invoices:", e)
            traceback.print_exc()
            raise
        invoices_data = InvoiceSerializer(result['invoices'], many=True).data
        print(invoices_data)
        return {
            'invoices': invoices_data,
            'pagination': result['pagination']
        }
    

    # Create Invoice
    def create_invoice(self, invoice_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            serializer = InvoiceCreateSerializer(data=invoice_data)
            
            if serializer.is_valid():
                invoice = serializer.save()
                return self.success_response(
                    message="Invoice created successfully",
                    data=InvoiceSerializer(invoice).data
                )
            else:
                return self.error_response(
                    message="Invalid invoice data",
                    details=serializer.errors
                )
                
        except Exception as e:
            return self.error_response(
                message="Failed to create invoice",
                details=str(e)
            )
    
    def update_invoice(self, invoice_id: str, invoice_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing invoice
        """
        try:
            invoice = Invoice.objects.get(id=invoice_id)
        except Invoice.DoesNotExist:
            return self.error_response(
                message="Invoice not found",
                details=f"Invoice with ID {invoice_id} does not exist"
            )
        
        try:
            serializer = InvoiceSerializer(invoice, data=invoice_data, partial=True)
            
            if serializer.is_valid():
                updated_invoice = serializer.save()
                return self.success_response(
                    message="Invoice updated successfully",
                    data=InvoiceSerializer(updated_invoice).data
                )
            else:
                return self.error_response(
                    message="Invalid invoice data",
                    details=serializer.errors
                )
                
        except Exception as e:
            return self.error_response(
                message="Failed to update invoice",
                details=str(e)
            )
    
    def delete_invoice(self, invoice_id: str) -> Dict[str, Any]:
        """
        Delete an invoice
        """
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            invoice_number = invoice.id
            invoice.delete()
            
            return self.success_response(
                message=f"Invoice {invoice_number} deleted successfully"
            )
            
        except Invoice.DoesNotExist:
            return self.error_response(
                message="Invoice not found",
                details=f"Invoice with ID {invoice_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to delete invoice",
                details=str(e)
            )
    
    def get_invoice_by_id(self, invoice_id: str) -> Dict[str, Any]:
        """
        Retrieve a specific invoice by ID
        """
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            serializer = InvoiceSerializer(invoice)
            return self.success_response(
                message="Invoice retrieved successfully",
                data=serializer.data
            )
        except Invoice.DoesNotExist:
            return self.error_response(
                message="Invoice not found",
                details=f"Invoice with ID {invoice_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve invoice",
                details=str(e)
            )

    def get_billing_stats(self) -> Dict[str, Any]:
        """
        Get billing statistics for dashboard
        """
        try:
            # Get statistics using query function
            stats = get_billing_statistics()
            
            return self.success_response(
                message="Billing stats retrieved successfully",
                data={
                    'totalRevenue': stats['total_revenue'],
                    'totalOrders': stats['total_orders'],
                    'outstandingAmount': stats['outstanding_amount'],
                    'monthlyRevenue': stats['monthly_revenue'],
                }
            )
            
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve billing stats",
                details=str(e)
            )


    # Update payment status for an invoice
    def update_payment_status(self, invoice_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            
            # Extract status from request data
            new_status = data.get('status') or data.get('payment_status')
            
            if not new_status:
                return self.error_response(
                    message="Invalid payment data",
                    details="status is required"
                )
            
            # Validate status against Invoice.Status choices
            valid_statuses = [choice[0] for choice in Invoice.Status.choices]
            if new_status not in valid_statuses:
                return self.error_response(
                    message="Invalid status",
                    details=f"Status must be one of: {', '.join(valid_statuses)}"
                )
            
            # Update invoice status
            invoice.status = new_status
            invoice.save()
            
            return self.success_response(
                message="Invoice status updated successfully",
                data=InvoiceSerializer(invoice).data
            )
            
        except Invoice.DoesNotExist:
            return self.error_response(
                message="Invoice not found",
                details=f"Invoice with ID {invoice_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to update invoice status",
                details=str(e)
            )
