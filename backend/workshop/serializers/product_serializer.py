# serializers/product_serializer.py
from rest_framework import serializers
from workshop.models.product import Product
from workshop.models.product_variant import ProductVariant

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'variant_name', 'sku', 'price', 'quantity', 'created_at']
        read_only_fields = ['sku', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'created_at', 'variants']

class ProductVariantCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        exclude = ['product', 'sku']  # product will be linked manually

class ProductCreateSerializer(serializers.ModelSerializer):
    variant = ProductVariantSerializer(write_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'variant']
        read_only_fields = ['id']

    def create(self, validated_data):
        variant_data = validated_data.pop('variant')
        product = Product.objects.create(**validated_data)
        ProductVariant.objects.create(product=product, **variant_data)
        return product
    
class VariantStockUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['price', 'quantity']

class ProductInvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name']