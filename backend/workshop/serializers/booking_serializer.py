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


class BookingTimeSlotSerializer(serializers.ModelSerializer):
    """
    Serializer for BookingTimeSlot model
    """
    available_slots = serializers.ReadOnlyField(source='get_available_slots')
    is_available = serializers.ReadOnlyField(source='is_slot_available')
    
    class Meta:
        model = BookingTimeSlot
        fields = [
            'id', 'date', 'start_time', 'end_time',
            'max_concurrent_bookings', 'is_available',
            'available_slots', 'created_at'
        ]


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
        fields = ['id', 'old_status', 'new_status', 'changed_by', 'changed_by_name', 'changed_at', 'change_reason']


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
    
    # Time slot information
    time_slot_details = BookingTimeSlotSerializer(source='time_slot', read_only=True)
    
    # Additional services
    additional_services = BookingAdditionalServiceSerializer(many=True, read_only=True)
    
    # Status history
    status_history = BookingStatusHistorySerializer(many=True, read_only=True)
    
    # Staff information
    assigned_staff_name = serializers.SerializerMethodField()
    
    # For backward compatibility
    scheduled_date = serializers.DateField(source='time_slot.date', read_only=True)
    scheduled_time = serializers.TimeField(source='time_slot.start_time', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'customer_details', 'car', 'car_details',
            'service', 'service_details', 'additional_services', 'time_slot', 'time_slot_details',
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
    Serializer for creating new bookings with time slot support
    """
    # Allow passing service code instead of UUID for easier frontend integration
    service_code = serializers.CharField(write_only=True, required=False)
    
    # For backward compatibility - accept scheduled_date/time and create time_slot automatically
    scheduled_date = serializers.DateField(write_only=True, required=False)
    scheduled_time = serializers.TimeField(write_only=True, required=False)
    
    class Meta:
        model = Booking
        fields = [
            'customer', 'car', 'service', 'service_code', 'time_slot',
            'scheduled_date', 'scheduled_time', 'estimated_duration_minutes',
            'status', 'customer_notes', 'quoted_price',
            'discount_amount', 'assigned_staff'
        ]
        extra_kwargs = {
            'service': {'required': False},
            'time_slot': {'required': False},
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

        # Handle time slot creation/selection
        if not data.get('time_slot'):
            # If no time_slot provided, try to create one from scheduled_date/time
            if data.get('scheduled_date') and data.get('scheduled_time'):
                from datetime import datetime, timedelta
                
                # Calculate end time based on service duration
                duration_minutes = data.get('estimated_duration_minutes', 60)
                start_datetime = datetime.combine(data['scheduled_date'], data['scheduled_time'])
                end_datetime = start_datetime + timedelta(minutes=duration_minutes)
                
                # Try to find existing time slot or create one
                time_slot, created = BookingTimeSlot.objects.get_or_create(
                    date=data['scheduled_date'],
                    start_time=data['scheduled_time'],
                    defaults={
                        'end_time': end_datetime.time(),
                        'max_concurrent_bookings': 1,
                        'is_available': True
                    }
                )
                data['time_slot'] = time_slot
            else:
                raise serializers.ValidationError("Either time_slot or both scheduled_date and scheduled_time must be provided")
        
        # Remove scheduled_date/time as they're not model fields anymore
        data.pop('scheduled_date', None)
        data.pop('scheduled_time', None)
        
        # Validate time slot availability
        if data.get('time_slot'):
            if not data['time_slot'].is_slot_available():
                raise serializers.ValidationError("Selected time slot is not available")

        # Validate car belongs to customer
        if data.get('car') and data.get('customer'):
            if data['car'].customer_id != data['customer'].id:
                raise serializers.ValidationError("Selected car does not belong to the specified customer")

        return data

    def create(self, validated_data):
        # Get customer and car objects to populate snapshot fields
        customer = validated_data['customer']
        car = validated_data['car']
        
        # Add snapshot fields that are required by the model
        validated_data.update({
            'customer_phone': customer.phone_number,
            'customer_email': customer.email,
            'car_make': car.make,
            'car_model': car.model,
            'car_year': str(car.year),
            'car_license_plate': car.license_plate,
            'car_color': car.color,
            'created_by': self.context.get('request').user if self.context.get('request') else None,
        })
        
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
            old_status='',  # Empty string for initial creation
            new_status=booking.status,
            changed_by=self.context.get('request').user if self.context.get('request') else None,
            change_reason=f"Booking created with status: {booking.status}"
        )

        return booking


class BookingUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating existing bookings
    """
    # For backward compatibility - accept scheduled_date/time and update time_slot
    scheduled_date = serializers.DateField(write_only=True, required=False)
    scheduled_time = serializers.TimeField(write_only=True, required=False)
    service = serializers.CharField(write_only=True, required=False)  # Accept service code
    
    class Meta:
        model = Booking
        fields = [
            'service', 'time_slot', 'scheduled_date', 'scheduled_time', 'estimated_duration_minutes',
            'status', 'customer_notes', 'staff_notes',
            'quoted_price', 'discount_amount', 'assigned_staff'
        ]
        extra_kwargs = {
            'time_slot': {'required': False},
        }

    def validate(self, data):
        # Handle service code to service instance conversion
        if data.get('service'):
            service_code = data.pop('service')
            try:
                from workshop.models.booking import Service
                service = Service.objects.get(code=service_code, is_active=True)
                data['service'] = service
            except Service.DoesNotExist:
                raise serializers.ValidationError(f"Service with code '{service_code}' not found or inactive")
        
        # Handle time slot updates from scheduled_date/time
        if data.get('scheduled_date') or data.get('scheduled_time'):
            instance = self.instance
            new_date = data.get('scheduled_date', instance.time_slot.date)
            new_time = data.get('scheduled_time', instance.time_slot.start_time)
            
            # Always find or create appropriate time slot when date/time is provided
            from datetime import datetime, timedelta
            
            duration_minutes = data.get('estimated_duration_minutes', instance.estimated_duration_minutes)
            start_datetime = datetime.combine(new_date, new_time)
            end_datetime = start_datetime + timedelta(minutes=duration_minutes)
            
            # Try to find existing time slot or create one
            time_slot, created = BookingTimeSlot.objects.get_or_create(
                date=new_date,
                start_time=new_time,
                defaults={
                    'end_time': end_datetime.time(),
                    'max_concurrent_bookings': 1,
                    'is_available': True
                }
            )
            
            # Check availability (excluding current booking)
            current_bookings = time_slot.bookings.filter(
                status__in=['confirmed', 'in_progress']
            ).exclude(id=instance.id)
            
            available_count = max(0, time_slot.max_concurrent_bookings - current_bookings.count())
            if available_count <= 0 and time_slot != instance.time_slot:
                raise serializers.ValidationError("Selected time slot is not available")
            
            data['time_slot'] = time_slot
        
        # Remove scheduled_date/time as they're not model fields
        data.pop('scheduled_date', None)
        data.pop('scheduled_time', None)
        
        return data

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
                change_reason=f"Status changed from {old_status} to {new_status}"
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
