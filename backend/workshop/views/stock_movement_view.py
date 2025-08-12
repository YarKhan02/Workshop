# workshop/views/stock_movement_view.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from workshop.services.stock_movement_service import StockMovementService
from workshop.models.product_variant import ProductVariant


class StockMovementView(ViewSet):
    """
    ViewSet for handling all stock movement operations
    """

    def _validate_quantity(self, quantity_data, field_name='quantity'):
        """Helper method to validate quantity input"""
        if quantity_data is None:
            return None, {'error': f'{field_name} is required'}
        
        try:
            quantity = int(quantity_data)
            if quantity <= 0:
                return None, {'error': f'{field_name} must be positive'}
            return quantity, None
        except (ValueError, TypeError):
            return None, {'error': f'{field_name} must be a valid positive integer'}

    def _get_user_email(self, request):
        """Helper method to get user email for audit trail"""
        return getattr(request.user, 'email', 'Anonymous') if hasattr(request, 'user') else 'System'

    def _get_variant_or_404(self, variant_id):
        """Helper method to get variant or return 404 error"""
        try:
            return ProductVariant.objects.get(pk=variant_id), None
        except ProductVariant.DoesNotExist:
            return None, Response({'error': 'Product variant not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='(?P<variant_id>[^/.]+)/adjust')
    def adjust_stock(self, request, variant_id=None):
        """Manually adjust stock quantity with proper movement tracking"""
        quantity_change = request.data.get('quantity_change')
        reason = request.data.get('reason', 'manual_adjustment')
        reference_id = request.data.get('reference_id', '')
        
        if quantity_change is None:
            return Response(
                {'error': 'quantity_change is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            quantity_change = int(quantity_change)
        except (ValueError, TypeError):
            return Response(
                {'error': 'quantity_change must be a valid integer'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get user information for audit trail
        adjusted_by = self._get_user_email(request)
        
        variant, error_response = self._get_variant_or_404(variant_id)
        if error_response:
            return error_response
        
        result, error = StockMovementService.adjust_stock(
            product_variant=variant,
            adjustment_amount=quantity_change,
            reason=reason,
            reference_id=reference_id,
            adjusted_by=adjusted_by
        )
        
        if result:
            return Response(result, status=status.HTTP_200_OK)
        return Response(error, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='(?P<variant_id>[^/.]+)/sale')
    def record_sale(self, request, variant_id=None):
        """Record a sale/usage that reduces stock"""
        sold_quantity, error = self._validate_quantity(request.data.get('quantity'))
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        
        reference_id = request.data.get('reference_id', '')
        sold_by = self._get_user_email(request)
        
        variant, error_response = self._get_variant_or_404(variant_id)
        if error_response:
            return error_response
        
        result, error = StockMovementService.create_sale_movement(
            product_variant=variant,
            sold_quantity=sold_quantity,
            reference_id=reference_id,
            sold_by=sold_by
        )
        
        if result:
            return Response(result, status=status.HTTP_200_OK)
        return Response(error, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='(?P<variant_id>[^/.]+)/restock')
    def record_restock(self, request, variant_id=None):
        """Record a restock/purchase that increases stock"""
        restock_quantity, error = self._validate_quantity(request.data.get('quantity'))
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        
        reference_id = request.data.get('reference_id', '')
        restocked_by = self._get_user_email(request)
        
        variant, error_response = self._get_variant_or_404(variant_id)
        if error_response:
            return error_response
        
        result, error = StockMovementService.create_restock_movement(
            product_variant=variant,
            restock_quantity=restock_quantity,
            reference_id=reference_id,
            restocked_by=restocked_by
        )
        
        if result:
            return Response(result, status=status.HTTP_200_OK)
        return Response(error, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='(?P<variant_id>[^/.]+)/damage')
    def record_damage(self, request, variant_id=None):
        """Record damaged/lost items that reduce stock"""
        damage_quantity, error = self._validate_quantity(request.data.get('quantity'))
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        
        reference_id = request.data.get('reference_id', '')
        reported_by = self._get_user_email(request)
        
        variant, error_response = self._get_variant_or_404(variant_id)
        if error_response:
            return error_response
        
        result, error = StockMovementService.create_damage_movement(
            product_variant=variant,
            damage_quantity=damage_quantity,
            reference_id=reference_id,
            reported_by=reported_by
        )
        
        if result:
            return Response(result, status=status.HTTP_200_OK)
        return Response(error, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='(?P<variant_id>[^/.]+)/history')
    def get_stock_history(self, request, variant_id=None):
        """Get complete stock movement history for a product variant"""
        variant, error_response = self._get_variant_or_404(variant_id)
        if error_response:
            return error_response
        
        # Optional query parameters for filtering
        limit = request.query_params.get('limit')
        if limit:
            try:
                limit = int(limit)
            except (ValueError, TypeError):
                limit = None
        
        history = StockMovementService.get_stock_history(variant, limit=limit)
        return Response(history, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='(?P<variant_id>[^/.]+)/summary')
    def get_stock_summary(self, request, variant_id=None):
        """Get stock summary including current quantity and recent movements"""
        variant, error_response = self._get_variant_or_404(variant_id)
        if error_response:
            return error_response
        
        # Get recent history (last 10 movements)
        recent_history = StockMovementService.get_stock_history(variant, limit=10)
        
        summary = {
            'variant_id': variant.id,
            'variant_name': variant.variant_name,
            'current_quantity': variant.quantity,
            'sku': variant.sku,
            'recent_movements': recent_history
        }
        
        return Response(summary, status=status.HTTP_200_OK)
