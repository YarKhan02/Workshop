# services/customer_service.py
from typing import Dict, Any, Optional
from django.db.models import Q

from workshop.models import User
from workshop.queries import customer_queries as cq
from workshop.serializers.customer_serializer import (
    CustomerDetailSerializer, 
    CustomerCreateSerializer, 
    CustomerInvoiceSerializer, 
    CustomerUpdateSerializer,
    CustomerStatsSerializer
)
from .base_service import BaseService


class CustomerService(BaseService):

    # Get all customers
    def get_all_customers(self) -> Dict[str, Any]:
        try:
            customers = User.objects.filter(role=User.Role.customer)
            serializer = CustomerDetailSerializer(customers, many=True)
            return self.success_response(
                message="Customers retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve customers",
                details=str(e)
            )
        
    def get_customer_stats(self) -> Dict[str, Any]:
        try:
            stats = cq.get_customer_stats_data()

            serializer = CustomerStatsSerializer(instance=stats)

            return serializer.data
            
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve customer statistics",
                details=str(e)
            )
    
    def get_customers_for_invoices(self, search_term: Optional[str] = None) -> Dict[str, Any]:
        try:
            queryset = User.objects.filter(role=User.Role.customer)
            
            if search_term:
                queryset = queryset.filter(
                    Q(name__icontains=search_term) |
                    Q(email__icontains=search_term) |
                    Q(phone_number__icontains=search_term)
                )
            
            serializer = CustomerInvoiceSerializer(queryset, many=True)
            return self.success_response(
                message="Invoice customers retrieved successfully",
                data=serializer.data
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve customers for invoices",
                details=str(e)
            )

    # Create Customer
    def create_customer(self, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            serializer = CustomerCreateSerializer(data=customer_data)
            
            if serializer.is_valid():
                customer = serializer.save()
                return self.success_response(
                    message="Customer created successfully",
                    data=CustomerDetailSerializer(customer).data
                )
            else:
                return self.error_response(
                    message="Invalid customer data",
                    details=serializer.errors
                )
        except Exception as e:
            return self.error_response(
                message="Failed to create customer",
                details=str(e)
            )

    # Update Customer
    def update_customer(self, customer_id: str, customer_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            customer = cq.get_customer_by_id(customer_id)
            if customer is None:
                return self.error_response(
                    message="Customer not found",
                    details=f"Customer with ID {customer_id} does not exist"
                )
        except User.DoesNotExist:
            return self.error_response(
                message="Customer not found",
                details=f"Customer with ID {customer_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Error retrieving customer",
                details=str(e)
            )
        
        try:
            serializer = CustomerUpdateSerializer(
                customer, 
                data=customer_data, 
                partial=True
            )
            
            if serializer.is_valid():
                updated_customer = serializer.save()
                return self.success_response(
                    message="Customer updated successfully",
                    data=CustomerDetailSerializer(updated_customer).data
                )
            else:
                return self.error_response(
                    message="Invalid customer data",
                    details=serializer.errors
                )
        except Exception as e:
            return self.error_response(
                message="Failed to update customer",
                details=str(e)
            )
    
    def delete_customer(self, customer_id: str) -> Dict[str, Any]:
        """
        Delete a customer
        """
        try:
            customer = User.objects.get(pk=customer_id)
            customer.delete()
            
            return self.success_response(
                message=f"Customer '{customer.name}' deleted successfully"
            )
        except User.DoesNotExist:
            return self.error_response(
                message="Customer not found",
                details=f"Customer with ID {customer_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to delete customer",
                details=str(e)
            )
    
    def get_customer_by_id(self, customer_id: str) -> Dict[str, Any]:
        """
        Retrieve a specific customer by ID
        """
        try:
            customer = User.objects.get(pk=customer_id)
            serializer = CustomerDetailSerializer(customer)
            return self.success_response(
                message="Customer retrieved successfully",
                data=serializer.data
            )
        except User.DoesNotExist:
            return self.error_response(
                message="Customer not found",
                details=f"Customer with ID {customer_id} does not exist"
            )
        except Exception as e:
            return self.error_response(
                message="Failed to retrieve customer",
                details=str(e)
            )
