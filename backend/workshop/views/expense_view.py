# views/expense_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from workshop.permissions import IsAdmin
from workshop.services.expense_service import ExpenseService


class ExpenseView(viewsets.ViewSet):
    """
    ViewSet for managing miscellaneous expenses/bills
    """

    def get_permissions(self):
        # Only admin users can manage expenses
        permission_classes = [IsAdmin]
        return [perm() for perm in permission_classes]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.expense_service = ExpenseService()

    @action(detail=False, methods=['get'], url_path='bills')
    def get_all_bills(self, request):
        """Get all miscellaneous bills/expenses"""
        result = self.expense_service.get_all_expenses()
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'], url_path='one-bill')
    def get_one_bill(self, request, pk=None):
        """Get a single bill/expense by ID"""
        result = self.expense_service.get_expense_by_id(pk)
        if 'error' in result:
            if result['message'] == 'Expense not found':
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            elif result['message'] == 'Invalid expense ID format':
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='add-bill')
    def add_bill(self, request):
        """Create a new miscellaneous bill/expense"""
        result = self.expense_service.create_expense(
            data=request.data,
            user=request.user
        )
        if 'error' in result:
            if result['message'] == 'Validation failed':
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='edit-bill')
    def edit_bill(self, request, pk=None):
        """Update an existing bill/expense"""
        result = self.expense_service.update_expense(pk, request.data)
        if 'error' in result:
            if result['message'] == 'Expense not found':
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            elif result['message'] in ['Invalid expense ID format', 'Validation failed']:
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], url_path='delete-bill')
    def delete_bill(self, request, pk=None):
        """Delete a bill/expense"""
        result = self.expense_service.delete_expense(pk)
        if 'error' in result:
            if result['message'] == 'Expense not found':
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            elif result['message'] == 'Invalid expense ID format':
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({'message': result['message']}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='categories')
    def get_categories(self, request):
        """Get all available expense categories"""
        result = self.expense_service.get_expense_categories()
        if 'error' in result:
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='by-category')
    def get_bills_by_category(self, request):
        """Get bills filtered by category"""
        category = request.query_params.get('category')
        if not category:
            return Response(
                {'error': 'category query parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = self.expense_service.get_expenses_by_category(category)
        if 'error' in result:
            if result['message'] == 'Invalid category':
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='by-date-range')
    def get_bills_by_date_range(self, request):
        """Get bills within a date range"""
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date query parameters are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        result = self.expense_service.get_expenses_by_date_range(start_date, end_date)
        if 'error' in result:
            if 'date' in result['message'].lower():
                return Response(result, status=status.HTTP_400_BAD_REQUEST)
            return Response(result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result['data'], status=status.HTTP_200_OK)
