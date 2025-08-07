# services/invoice_service.py
from typing import Dict, Any, Optional
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.db.models import Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta

from workshop.queries.combined_invoice_queries import (
    get_optimized_inventory_invoices, 
    get_optimized_booking_invoices,
    get_all_invoices_combined
)
from workshop.models.invoice import Invoice
from workshop.serializers.invoice_serializer import InvoiceCreateSerializer, InvoiceSerializer
from workshop.serializers.combined_invoice_serializer import (
    InventoryInvoiceSerializer,
    BookingInvoiceSerializer,
    CombinedInvoiceSerializer
)
from .base_service import BaseService


class InvoiceService(BaseService):
    """
    Invoice service containing all business logic for invoice operations
    """
    
    def get_invoices_paginated(
        self, 
        search: Optional[str] = None,
        status_filter: Optional[str] = None,
        page: int = 1,
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Retrieve paginated invoices with both inventory and booking invoices
        """
        try:
            # Validate pagination parameters
            page = max(1, page)
            limit = max(1, min(100, limit))  # Limit max to 100 for performance
            
            # Get both types of invoices separately
            inventory_invoices = get_optimized_inventory_invoices()
            booking_invoices = get_optimized_booking_invoices()
            
            # Apply search filter to both
            if search:
                inventory_search = Q(customer__first_name__icontains=search) | \
                                 Q(customer__last_name__icontains=search) | \
                                 Q(id__icontains=search)
                inventory_invoices = inventory_invoices.filter(inventory_search)
                
                booking_search = Q(customer__first_name__icontains=search) | \
                               Q(customer__last_name__icontains=search) | \
                               Q(invoice_number__icontains=search) | \
                               Q(id__icontains=search)
                booking_invoices = booking_invoices.filter(booking_search)
            
            # Apply status filter
            if status_filter:
                inventory_invoices = inventory_invoices.filter(status=status_filter)
                booking_invoices = booking_invoices.filter(status=status_filter)
            
            # Order by created date (most recent first)
            inventory_invoices = inventory_invoices.order_by('-created_at')
            booking_invoices = booking_invoices.order_by('-created_at')
            
            # Serialize the data
            inventory_serializer = InventoryInvoiceSerializer(inventory_invoices, many=True)
            booking_serializer = BookingInvoiceSerializer(booking_invoices, many=True)
            
            # Combine counts
            inventory_count = inventory_invoices.count()
            booking_count = booking_invoices.count()
            total_count = inventory_count + booking_count
            
            # Calculate pagination info
            total_pages = max(1, (total_count + limit - 1) // limit)
            
            response_data = {
                'data': {
                    'inventory_invoices': inventory_serializer.data,
                    'booking_invoices': booking_serializer.data,
                    'inventory_count': inventory_count,
                    'booking_count': booking_count,
                    'total_count': total_count,
                },
                'pagination': {
                    'current_page': page,
                    'total_pages': total_pages,
                    'total_count': total_count,
                    'per_page': limit,
                    'has_next': page < total_pages,
                    'has_previous': page > 1,
                }
            }
            
            return self.success_response(
                message="Invoices retrieved successfully",
                data=response_data
            )
            
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve invoices",
                details=str(e)
            )
    
    def create_invoice(self, invoice_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new invoice with validation
        """
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
            
            # Get all invoices
            invoices = Invoice.objects.all()
            
            # Calculate stats
            total_revenue = invoices.filter(payment_status='paid').aggregate(
                total=Sum('total_amount')
            )['total'] or 0
            
            total_orders = invoices.count()
            
            outstanding_amount = invoices.filter(
                payment_status__in=['pending', 'partially_paid']
            ).aggregate(
                total=Sum('total_amount')
            )['total'] or 0
            
            # Monthly revenue (current month)
            current_month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            monthly_revenue = invoices.filter(
                payment_status='paid',
                created_at__gte=current_month_start
            ).aggregate(
                total=Sum('total_amount')
            )['total'] or 0
            
            return self.success_response(
                message="Billing stats retrieved successfully",
                data={
                    'totalRevenue': float(total_revenue),
                    'totalOrders': total_orders,
                    'outstandingAmount': float(outstanding_amount),
                    'monthlyRevenue': float(monthly_revenue),
                }
            )
            
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve billing stats",
                details=str(e)
            )

    def update_payment_status(self, invoice_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update payment status and method for an invoice
        """
        try:
            invoice = Invoice.objects.get(id=invoice_id)
            
            # Extract payment status and method from request data
            payment_status = data.get('payment_status') or data.get('status')
            payment_method = data.get('payment_method')
            
            if not payment_status:
                return self.error_response(
                    message="Invalid payment data",
                    details="payment_status is required"
                )
            
            # Validate payment status
            valid_statuses = ['pending', 'paid', 'partially_paid', 'cancelled']
            if payment_status not in valid_statuses:
                return self.error_response(
                    message="Invalid payment status",
                    details=f"Status must be one of: {', '.join(valid_statuses)}"
                )
            
            # Update invoice
            invoice.payment_status = payment_status
            if payment_method:
                invoice.payment_method = payment_method
            
            # Set paid date if status is paid
            if payment_status == 'paid':
                from django.utils import timezone
                invoice.paid_date = timezone.now()
            else:
                invoice.paid_date = None
            
            invoice.save()
            
            return self.success_response(
                message="Payment status updated successfully",
                data=InvoiceSerializer(invoice).data
            )
            
        except Invoice.DoesNotExist:
            return self.error_response(
                message="Invoice not found",
                details=f"Invoice with ID {invoice_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to update payment status",
                details=str(e)
            )
