# workshop/serializers/booking_serializer.py
from rest_framework import serializers
from django.db.models import Q
from workshop.models import Service
from workshop.models.booking import Booking
from workshop.models.customer import Customer
from workshop.models.car import Car
from workshop.models.user import User
from workshop.models.daily_availability import DailyAvailability
from workshop.helper.booking_helpers import is_date_available_for_booking


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
        fields = ['id', 
                  'name', 
                  'code', 
                  'category', 
                  'base_price', 
                  'estimated_duration_minutes'
        ]

class BookingListSerializer(serializers.ModelSerializer):
    """
    Optimized serializer for booking list view
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
    scheduledDate = serializers.DateField(source='booking_date')
    estimatedDuration = serializers.IntegerField(source='estimated_duration_minutes')
    totalAmount = serializers.DecimalField(source='final_price', max_digits=10, decimal_places=2)
    createdAt = serializers.DateTimeField(source='created_at')

    class Meta:
        model = Booking
        fields = [
            'id', 'customerId', 'customerName', 'customerPhone', 'customerEmail',
            'carId', 'carMake', 'carModel', 'carLicensePlate',
            'serviceType', 'serviceName', 'scheduledDate',
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
    
    # Payment and invoice information
    payment_status = serializers.ReadOnlyField()
    is_paid = serializers.ReadOnlyField()
    can_edit = serializers.ReadOnlyField()
    invoice_id = serializers.CharField(source='invoice.id', read_only=True)
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)
    
    # For backward compatibility
    scheduled_date = serializers.DateField(source='booking_date', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'customer_details', 'car', 'car_details',
            'service', 'service_details', 'additional_services',
            'scheduled_date', 'booking_date', 'estimated_duration_minutes',
            'actual_start_time', 'actual_end_time', 'status',
            'customer_notes', 'staff_notes', 'quoted_price', 'discount_amount',
            'final_price', 'assigned_staff',
            'assigned_staff_name', 'status_history', 'created_at', 'updated_at',
            'payment_status', 'is_paid', 'can_edit', 'invoice_id', 'invoice_number'
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
    Serializer for creating new bookings with simplified date-based booking
    """
    # Allow passing service code instead of UUID for easier frontend integration
    service_code = serializers.CharField(write_only=True, required=False)
    service = serializers.CharField(required=False)  # Allow both UUID and string codes
    
    # Simple date-based booking
    booking_date = serializers.DateField()
    
    class Meta:
        model = Booking
        fields = [
            'customer', 'car', 'service', 'service_code', 'booking_date',
            'estimated_duration_minutes', 'status', 'customer_notes', 
            'quoted_price', 'discount_amount', 'assigned_staff'
        ]
        extra_kwargs = {
            'service': {'required': False},
            'status': {'default': 'pending'},
            'estimated_duration_minutes': {'required': False},
            'quoted_price': {'required': False},
            'discount_amount': {'default': 0},
            'assigned_staff': {'required': False}
        }

    def validate(self, data):
        # Handle service selection by code or ID
        service_resolved = False
        
        # Check if service_code is provided
        if 'service_code' in data and data['service_code']:
            try:
                service = Service.objects.get(code=data['service_code'], is_active=True)
                data['service'] = service
                service_resolved = True
                # Auto-set duration if not provided
                if 'estimated_duration_minutes' not in data:
                    data['estimated_duration_minutes'] = service.estimated_duration_minutes
                # Auto-set amount if not provided
                if 'quoted_price' not in data:
                    data['quoted_price'] = service.base_price
            except Service.DoesNotExist:
                raise serializers.ValidationError(f"Service with code '{data['service_code']}' not found or inactive")
            data.pop('service_code')
        
        # Check if service field contains a string (service code or UUID) instead of instance
        elif 'service' in data and isinstance(data['service'], str):
            print(f"DEBUG: Looking up service with ID/code: {data['service']}")
            try:
                # First try to get by UUID
                service = Service.objects.get(id=data['service'], is_active=True)
                print(f"DEBUG: Found service by UUID: {service.name}, base_price: {service.base_price}")
                data['service'] = service
                service_resolved = True
                # Auto-set duration if not provided
                if 'estimated_duration_minutes' not in data:
                    data['estimated_duration_minutes'] = service.estimated_duration_minutes
                    print(f"DEBUG: Set estimated_duration_minutes to: {service.estimated_duration_minutes}")
                # Auto-set amount if not provided
                if 'quoted_price' not in data:
                    data['quoted_price'] = service.base_price
                    print(f"DEBUG: Set quoted_price to: {service.base_price}")
            except (Service.DoesNotExist, ValueError):
                # If UUID lookup fails, try by service code
                try:
                    service = Service.objects.get(code=data['service'], is_active=True)
                    data['service'] = service
                    service_resolved = True
                    # Auto-set duration if not provided
                    if 'estimated_duration_minutes' not in data:
                        data['estimated_duration_minutes'] = service.estimated_duration_minutes
                    # Auto-set amount if not provided
                    if 'quoted_price' not in data:
                        data['quoted_price'] = service.base_price
                except Service.DoesNotExist:
                    raise serializers.ValidationError(f"Service with ID or code '{data['service']}' not found or inactive")
        
        # Check if service instance is provided
        elif data.get('service'):
            service_resolved = True
        
        # Ensure we have a service
        if not service_resolved:
            raise serializers.ValidationError("Either service or service_code must be provided")

        print(f"DEBUG: Final data before validation continues: {data}")

        # Convert UUID strings to model instances for customer and car
        if 'customer' in data and isinstance(data['customer'], str):
            try:
                data['customer'] = Customer.objects.get(id=data['customer'])
            except Customer.DoesNotExist:
                raise serializers.ValidationError("Invalid customer ID")
        
        if 'car' in data and isinstance(data['car'], str):
            try:
                data['car'] = Car.objects.get(id=data['car'])
            except Car.DoesNotExist:
                raise serializers.ValidationError("Invalid car ID")

        # Validate booking date availability
        if 'booking_date' in data:
            booking_date = data['booking_date']
            
            # Check if date is available for booking
            if not is_date_available_for_booking(booking_date):
                raise serializers.ValidationError("Selected date is not available for booking")
        
        # Validate car belongs to customer
        if data.get('car') and data.get('customer'):
            # Handle both UUID strings and model instances
            customer_id = data['customer'].id if hasattr(data['customer'], 'id') else data['customer']
            car_customer_id = data['car'].customer_id if hasattr(data['car'], 'customer_id') else data['car'].customer.id
            
            if str(car_customer_id) != str(customer_id):
                raise serializers.ValidationError("Selected car does not belong to the specified customer")

        # Remove service_code as it's not a model field
        data.pop('service_code', None)

        return data

    def create(self, validated_data):
        from workshop.helper.booking_helpers import (
            prepare_booking_snapshot_data, 
            calculate_booking_final_price,
            handle_booking_creation
        )
        
        # Get customer and car objects to populate snapshot fields
        customer = validated_data['customer']
        car = validated_data['car']
        
        # Add snapshot fields that are required by the model
        snapshot_data = prepare_booking_snapshot_data(customer, car)
        validated_data.update(snapshot_data)
        
        # Handle created_by field safely
        # For customer bookings, created_by should be None since it's self-service
        # Only set created_by if the request user is a staff User instance
        request = self.context.get('request')
        if (request and hasattr(request, 'user') and request.user.is_authenticated 
            and hasattr(request.user, '__class__') and request.user.__class__.__name__ == 'User'):
            validated_data['created_by'] = request.user
        else:
            validated_data['created_by'] = None
        
        # Calculate final price
        final_price = calculate_booking_final_price(
            validated_data['quoted_price'], 
            validated_data.get('discount_amount', 0)
        )
        validated_data['final_price'] = final_price
        
        # Create the booking
        booking = super().create(validated_data)
        
        # Handle daily availability update
        handle_booking_creation(booking)

        return booking


class BookingUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating existing bookings with simplified date-based booking
    """
    # Simple date-based booking
    booking_date = serializers.DateField(required=False)
    service = serializers.CharField(write_only=True, required=False)  # Accept service code
    
    class Meta:
        model = Booking
        fields = [
            'service', 'booking_date', 'estimated_duration_minutes',
            'status', 'customer_notes', 'staff_notes',
            'quoted_price', 'discount_amount', 'assigned_staff'
        ]

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
        
        # Validate booking date availability (if changing date)
        if 'booking_date' in data:
            booking_date = data['booking_date']
            instance = self.instance
            
            # Check if date is available (excluding current booking)
            if not is_date_available_for_booking(booking_date, exclude_booking_id=instance.id):
                raise serializers.ValidationError("Selected date is not available for booking")
        
        return data

    def update(self, instance, validated_data):
        from workshop.helper.booking_helpers import (
            calculate_booking_final_price,
            handle_booking_status_change,
            update_daily_availability_for_booking
        )
        
        # Track status and date changes
        old_status = instance.status
        old_date = instance.booking_date
        new_status = validated_data.get('status', old_status)
        new_date = validated_data.get('booking_date', old_date)
        
    def update(self, instance, validated_data):
        from workshop.helper.booking_helpers import (
            calculate_booking_final_price,
            handle_booking_status_change,
            update_daily_availability_for_booking
        )
        
        # Track status and date changes
        old_status = instance.status
        old_date = instance.booking_date
        new_status = validated_data.get('status', old_status)
        new_date = validated_data.get('booking_date', old_date)
        
        # Handle availability updates if date changed
        if old_date != new_date:
            # Free the old date's slot if booking was taking a slot
            if old_status in ['pending', 'confirmed', 'in_progress']:
                # Create a temporary booking object with old date to free the slot
                from copy import copy
                temp_booking = copy(instance)
                temp_booking.booking_date = old_date
                update_daily_availability_for_booking(temp_booking, old_status, 'cancelled')
        
        # Update the booking
        booking = super().update(instance, validated_data)
        
        # Handle availability for the new date if date changed
        if old_date != new_date:
            # Book the new date's slot if booking takes a slot
            if new_status in ['pending', 'confirmed', 'in_progress']:
                update_daily_availability_for_booking(booking, None, new_status)
        
        # Handle status change (if status changed but not date)
        elif old_status != new_status:
            update_daily_availability_for_booking(booking, old_status, new_status)
        
        # Recalculate final price if pricing fields changed
        if 'quoted_price' in validated_data or 'discount_amount' in validated_data:
            final_price = calculate_booking_final_price(
                booking.quoted_price, 
                booking.discount_amount
            )
            booking.final_price = final_price
            booking.save(update_fields=['final_price'])

        return booking


class BookingStatsSerializer(serializers.Serializer):
    """
    Serializer for booking statistics - matches frontend MockBookingStats interface
    """
    totalBookings = serializers.IntegerField()
    completedBookings = serializers.IntegerField()
    pendingBookings = serializers.IntegerField()
    todayBookings = serializers.IntegerField()
