# workshop/serializers/__init__.py
from .user_serializer import UserSerializer
from .customer_serializer import CustomerDetailSerializer
from .invoice_item_serializer import InvoiceItemSerializer
from .invoice_serializer import InvoiceSerializer
from .car_serializer import CarSerializer
from .product_serializer import ProductSerializer, ProductCreateSerializer, ProductVariantSerializer, ProductVariantCreateSerializer, VariantStockUpdateSerializer
from .booking_serializer import (
    ServiceSerializer, ServiceListSerializer, ServiceCreateSerializer, ServiceItemSerializer,
    BookingListSerializer, BookingDetailSerializer,
    BookingCreateSerializer, BookingUpdateSerializer,
    BookingStatsSerializer
)
from .dashboard_serializer import DashboardStatsSerializer, RecentBookingSerializer
from .notification_serializer import (
    NotificationSerializer,
    NotificationStatsSerializer,
    MarkAsReadSerializer
)
# MyBookingsSerializer is imported directly in services to avoid circular imports