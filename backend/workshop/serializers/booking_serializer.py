# workshop/serializers/booking_serializer.py
from rest_framework import serializers
from django.db.models import Q
from workshop.models.booking import Service, Booking, BookingStatusHistory, BookingAdditionalService, BookingTimeSlot, BookingReminder
from workshop.models.customer import Customer
from workshop.models.car import Car
from workshop.models.user import User


class ServiceSerializer(serializers.ModelSerializer):
    """
    Serializer for Service model
    """
    class Meta:
        model = Service
        fields = [
            'id', 'name', 'code', 'description', 'category',
            'base_price', 'estimated_duration_minutes', 'is_active',
            'created_at', 'updated_at'
        ]


class ServiceListSerializer(serializers.ModelSerializer):
    """
    Simplified Service serializer for lists/dropdowns
    """
    class Meta:
        model = Service
        fields = ['id', 'name', 'code', 'category', 'base_price', 'estimated_duration_minutes']


class BookingAdditionalServiceSerializer(serializers.ModelSerializer):
    """
    Serializer for additional services in a booking
    """
    service_name = serializers.CharField(source='service.name', read_only=True)
    service_code = serializers.CharField(source='service.code', read_only=True)
    
    class Meta:
        model = BookingAdditionalService
        fields = ['id', 'service', 'service_name', 'service_code', 'quantity', 'unit_price', 'total_price']


class BookingStatusHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for booking status history
    """
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = BookingStatusHistory
        fields = ['id', 'old_status', 'new_status', 'changed_by', 'changed_by_name', 'changed_at', 'notes']


class BookingListSerializer(serializers.ModelSerializer):
    """
    Serializer for booking list view - matches frontend MockBooking interface
    """
    # Customer fields
    customerId = serializers.UUIDField(source='customer.id', read_only=True)
    customerName = serializers.SerializerMethodField()
    customerPhone = serializers.CharField(source='customer.phone_number', read_only=True)
    customerEmail = serializers.CharField(source='customer.email', read_only=True)
    
    # Car fields
    carId = serializers.UUIDField(source='car.id', read_only=True)
    carMake = serializers.CharField(source='car.make', read_only=True)
    carModel = serializers.CharField(source='car.model', read_only=True)
    carLicensePlate = serializers.CharField(source='car.license_plate', read_only=True)
    
    # Service fields
    serviceType = serializers.CharField(source='service.code', read_only=True)
    serviceName = serializers.CharField(source='service.name', read_only=True)
    
    # Booking fields
    scheduledDate = serializers.DateField(source='scheduled_date')
    scheduledTime = serializers.TimeField(source='scheduled_time')
    estimatedDuration = serializers.IntegerField(source='estimated_duration_minutes')
    totalAmount = serializers.DecimalField(source='final_price', max_digits=10, decimal_places=2)
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Booking
        fields = [
            'id', 'customerId', 'customerName', 'customerPhone', 'customerEmail',
            'carId', 'carMake', 'carModel', 'carLicensePlate',
            'serviceType', 'serviceName', 'scheduledDate', 'scheduledTime',
            'estimatedDuration', 'status', 'customer_notes', 'totalAmount', 'createdAt'
        ]

    def get_customerName(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}".strip()


class BookingDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for single booking view
    """
    # Customer information
    customer_details = serializers.SerializerMethodField()
    
    # Car information
    car_details = serializers.SerializerMethodField()
    
    # Service information
    service_details = ServiceSerializer(source='service', read_only=True)
    
    # Additional services
    additional_services = BookingAdditionalServiceSerializer(many=True, read_only=True)
    
    # Status history
    status_history = BookingStatusHistorySerializer(many=True, read_only=True)
    
    # Staff information
    assigned_staff_name = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'customer_details', 'car', 'car_details',
            'service', 'service_details', 'additional_services',
            'scheduled_date', 'scheduled_time', 'estimated_duration_minutes',
            'actual_start_time', 'actual_end_time', 'status',
            'customer_notes', 'staff_notes', 'quoted_price', 'discount_amount',
            'final_price', 'assigned_staff',
            'assigned_staff_name', 'status_history', 'created_at', 'updated_at'
        ]

    def get_customer_details(self, obj):
        return {
            'id': obj.customer.id,
            'name': f"{obj.customer.first_name} {obj.customer.last_name}".strip(),
            'email': obj.customer.email,
            'phone_number': obj.customer.phone_number,
            'username': obj.customer.username
        }

    def get_car_details(self, obj):
        return {
            'id': obj.car.id,
            'make': obj.car.make,
            'model': obj.car.model,
            'year': obj.car.year,
            'license_plate': obj.car.license_plate,
            'color': obj.car.color
        }

    def get_assigned_staff_name(self, obj):
        if obj.assigned_staff:
            return f"{obj.assigned_staff.first_name} {obj.assigned_staff.last_name}".strip()
        return None


class BookingCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new bookings
    """
    # Allow passing service code instead of UUID for easier frontend integration
    service_code = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Booking
        fields = [
            'customer', 'car', 'service', 'service_code',
            'scheduled_date', 'scheduled_time', 'estimated_duration_minutes',
            'status', 'customer_notes', 'quoted_price',
            'discount_amount', 'assigned_staff'
        ]
        extra_kwargs = {
            'service': {'required': False},
            'status': {'default': 'pending'},
            'estimated_duration_minutes': {'required': False}
        }

    def validate(self, data):
        # Handle service selection by code or ID
        if 'service_code' in data and data['service_code']:
            try:
                service = Service.objects.get(code=data['service_code'], is_active=True)
                data['service'] = service
                # Auto-set duration if not provided
                if 'estimated_duration_minutes' not in data:
                    data['estimated_duration_minutes'] = service.estimated_duration_minutes
                # Auto-set amount if not provided
                if 'quoted_price' not in data:
                    data['quoted_price'] = service.base_price
            except Service.DoesNotExist:
                raise serializers.ValidationError(f"Service with code '{data['service_code']}' not found or inactive")
            data.pop('service_code')
        elif not data.get('service'):
            raise serializers.ValidationError("Either service or service_code must be provided")

        # Validate car belongs to customer
        if data.get('car') and data.get('customer'):
            if data['car'].customer_id != data['customer'].id:
                raise serializers.ValidationError("Selected car does not belong to the specified customer")

        return data

    def create(self, validated_data):
        booking = super().create(validated_data)
        
        # Calculate final amount
        final_amount = booking.quoted_price
        if booking.discount_amount:
            final_amount -= booking.discount_amount
        booking.final_price = final_amount
        booking.save()

        # Create initial status history
        BookingStatusHistory.objects.create(
            booking=booking,
            old_status=None,
            new_status=booking.status,
            changed_by=self.context.get('request').user if self.context.get('request') else None,
            notes=f"Booking created with status: {booking.status}"
        )

        return booking


class BookingUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating existing bookings
    """
    class Meta:
        model = Booking
        fields = [
            'scheduled_date', 'scheduled_time', 'estimated_duration_minutes',
            'status', 'customer_notes', 'staff_notes',
            'quoted_price', 'discount_amount', 'assigned_staff'
        ]

    def update(self, instance, validated_data):
        # Track status changes
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Update the booking
        booking = super().update(instance, validated_data)
        
        # Recalculate final amount if needed
        if 'quoted_price' in validated_data or 'discount_amount' in validated_data:
            final_amount = booking.quoted_price
            if booking.discount_amount:
                final_amount -= booking.discount_amount
            booking.final_price = final_amount
            booking.save()
        
        # Create status history if status changed
        if old_status != new_status:
            BookingStatusHistory.objects.create(
                booking=booking,
                old_status=old_status,
                new_status=new_status,
                changed_by=self.context.get('request').user if self.context.get('request') else None,
                notes=f"Status changed from {old_status} to {new_status}"
            )
        
        return booking


class BookingStatsSerializer(serializers.Serializer):
    """
    Serializer for booking statistics - matches frontend MockBookingStats interface
    """
    totalBookings = serializers.IntegerField()
    completedBookings = serializers.IntegerField()
    pendingBookings = serializers.IntegerField()
    todayBookings = serializers.IntegerField()
