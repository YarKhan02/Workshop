# workshop/models/__init__.py
from .user import User
from .customer import Customer
from .car import Car
from .product import Product
from .product_variant import ProductVariant
from .invoice import Invoice
from .invoice_items import InvoiceItems
from .notification import Notification
from .daily_availability import DailyAvailability
from .booking import (
    Service,
    Booking,
    BookingStatusHistory,
    BookingAdditionalService,
    BookingTimeSlot,
    BookingReminder
)