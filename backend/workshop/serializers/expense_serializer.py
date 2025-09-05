# serializers/expense_serializer.py
from rest_framework import serializers
from workshop.models.expenses import Expense, ExpenseCategory
from workshop.models import User


class ExpenseSerializer(serializers.ModelSerializer):
    """Serializer for expense details"""
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id',
            'title',
            'category',
            'amount',
            'description',
            'paid_on',
            'created_at',
            'updated_at',
            'created_by',
            'created_by_name',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name']


class ExpenseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new expense"""

    class Meta:
        model = Expense
        fields = [
            'title',
            'category',
            'amount',
            'description',
            'paid_on',
        ]

    def validate_amount(self, value):
        """Validate that amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value

    def validate_title(self, value):
        """Validate and clean title"""
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty")
        return value.strip()

    def create(self, validated_data):
        """Create expense with logged-in user as created_by"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)


class ExpenseUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating an expense"""

    class Meta:
        model = Expense
        fields = [
            'title',
            'category',
            'amount',
            'description',
            'paid_on',
        ]

    def validate_amount(self, value):
        """Validate that amount is positive"""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")
        return value

    def validate_title(self, value):
        """Validate and clean title"""
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty")
        return value.strip()


class ExpenseListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for expense list views"""
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id',
            'title',
            'category',
            'amount',
            'paid_on',
            'created_at',
            'created_by_name',
        ]


class ExpenseCategorySerializer(serializers.Serializer):
    """Serializer for expense categories"""
    value = serializers.CharField()
    label = serializers.CharField()

    def to_representation(self, instance):
        return {
            'value': instance[0],
            'label': instance[1]
        }
