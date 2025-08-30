# workshop/services/stock_movement_service.py
from django.db import transaction
from workshop.models.stock_movement import StockMovement
from workshop.models.product_variant import ProductVariant
from decimal import Decimal, InvalidOperation


class StockMovementService:
    
    @staticmethod
    def create_initial_stock(product_variant, initial_quantity, created_by="System", reference_id=""):
        try:
            if initial_quantity <= 0:
                return None, None  # No movement needed for zero quantity
            
            movement = StockMovement.objects.create(
                product_variant=product_variant,
                change_amount=initial_quantity,
                reason='INITIAL',
                quantity_before=0,
                quantity_after=initial_quantity,
                reference_id=reference_id or f"Initial_Stock_{product_variant.id}",
                created_by=created_by
            )
            
            return movement, None
            
        except Exception as e:
            return None, {'error': f'Failed to create initial stock movement: {str(e)}'}

    @staticmethod
    def track_quantity_change(product_variant, old_quantity, new_quantity, reason='ADJUSTMENT', 
                            reference_id="", updated_by="System"):
        try:
            if old_quantity == new_quantity:
                return None, None  # No change, no movement needed
            
            change_amount = new_quantity - old_quantity
            
            # Generate descriptive reference if not provided
            if not reference_id:
                change_type = "Increase" if change_amount > 0 else "Decrease"
                reference_id = f"Manual_Update_{change_type}_{old_quantity}_to_{new_quantity}"
            
            movement = StockMovement.objects.create(
                product_variant=product_variant,
                change_amount=change_amount,
                reason=reason,
                quantity_before=old_quantity,
                quantity_after=new_quantity,
                reference_id=reference_id,
                created_by=updated_by
            )
            
            return movement, None
            
        except Exception as e:
            return None, {'error': f'Failed to track quantity change: {str(e)}'}

    @staticmethod
    def adjust_stock(product_variant, adjustment_amount, reason='ADJUSTMENT', 
                    reference_id="", adjusted_by="System"):
        try:
            with transaction.atomic():
                # Lock the variant to prevent race conditions
                variant = ProductVariant.objects.select_for_update().get(id=product_variant.id)
                try:
                    original_quantity = Decimal(variant.quantity)
                    adjustment_amount = Decimal(adjustment_amount)
                except (InvalidOperation, TypeError, ValueError):
                    return None, {'error': 'Quantity and adjustment must be decimal-compatible'}
                new_quantity = original_quantity + adjustment_amount
                # Validate new quantity
                if new_quantity < 0:
                    return None, {
                        'error': f'Adjustment would result in negative quantity: '
                                f'{original_quantity} + {adjustment_amount} = {new_quantity}'
                    }
                # Update variant quantity
                variant.quantity = new_quantity
                variant.save(update_fields=['quantity'])
                # Create stock movement record
                movement = StockMovement.objects.create(
                    product_variant=variant,
                    change_amount=adjustment_amount,
                    reason=reason,
                    quantity_before=original_quantity,
                    quantity_after=new_quantity,
                    reference_id=reference_id or f"Manual_Adjustment_{variant.id}",
                    created_by=adjusted_by
                )
                return {
                    'message': 'Stock adjusted successfully',
                    'variant_id': str(variant.id),
                    'quantity_before': original_quantity,
                    'quantity_after': new_quantity,
                    'adjustment_amount': adjustment_amount,
                    'movement_id': str(movement.id)
                }, None
        except ProductVariant.DoesNotExist:
            return None, {'error': 'Product variant not found'}
        except Exception as e:
            return None, {'error': f'Error adjusting stock: {str(e)}'}

    @staticmethod
    def get_stock_history(product_variant, limit=50):
        try:
            movements = StockMovement.get_stock_history(product_variant, limit=limit)
            
            # Serialize the movement data
            movement_data = []
            for movement in movements:
                movement_data.append({
                    'id': str(movement.id),
                    'change_amount': movement.change_amount,
                    'reason': movement.reason,
                    'reason_display': movement.get_reason_display(),
                    'quantity_before': movement.quantity_before,
                    'quantity_after': movement.quantity_after,
                    'reference_id': movement.reference_id,
                    'created_by': movement.created_by,
                    'updated_at': movement.updated_at.isoformat(),
                    'movement_type': movement.movement_type,
                })
            
            return {
                'variant_id': str(product_variant.id),
                'variant_sku': product_variant.sku,
                'current_quantity': product_variant.quantity,
                'movements': movement_data
            }, None
            
        except Exception as e:
            return None, {'error': f'Error retrieving stock history: {str(e)}'}

    @staticmethod
    def create_sale_movement(product_variant, sold_quantity, reference_id="", sold_by="System"):
        if sold_quantity <= 0:
            return None, {'error': 'Sold quantity must be positive'}

        print(f"Creating sale movement - Variant ID: {product_variant.id}, Sold Quantity: {sold_quantity}")

        # Use negative amount for stock decrease
        return StockMovementService.adjust_stock(
            product_variant=product_variant,
            adjustment_amount=-sold_quantity,
            reason='SALE',
            reference_id=reference_id or f"Sale_{product_variant.id}",
            adjusted_by=sold_by
        )

    @staticmethod
    def create_restock_movement(product_variant, restock_quantity, reference_id="", restocked_by="System"):
        if restock_quantity <= 0:
            return None, {'error': 'Restock quantity must be positive'}
        
        return StockMovementService.adjust_stock(
            product_variant=product_variant,
            adjustment_amount=restock_quantity,
            reason='PURCHASE',
            reference_id=reference_id or f"Restock_{product_variant.id}",
            adjusted_by=restocked_by
        )

    @staticmethod
    def create_damage_movement(product_variant, damaged_quantity, reference_id="", reported_by="System"):
        if damaged_quantity <= 0:
            return None, {'error': 'Damaged quantity must be positive'}
        
        # Use negative amount for stock decrease
        return StockMovementService.adjust_stock(
            product_variant=product_variant,
            adjustment_amount=-damaged_quantity,
            reason='DAMAGE',
            reference_id=reference_id or f"Damage_{product_variant.id}",
            adjusted_by=reported_by
        )
