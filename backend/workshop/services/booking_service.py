# workshop/services/booking_service.py
from workshop.models.booking import Booking, BookingStatusHistory, BookingAdditionalService
from workshop.models.customer import Customer
from workshop.models.car import Car
from workshop.serializers.booking_serializer import (
    BookingListSerializer, BookingDetailSerializer, 
    BookingCreateSerializer, BookingUpdateSerializer,
    BookingStatsSerializer
)
from django.db.models import Q
from django.utils import timezone
from datetime import datetime

class BookingService:
    def get_bookings(self, params):
        queryset = Booking.objects.select_related('customer', 'car', 'service', 'assigned_staff').all()
        # Filtering
        status_filter = params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        customer_filter = params.get('customer')
        if customer_filter:
            queryset = queryset.filter(customer_id=customer_filter)
        service_filter = params.get('service')
        if service_filter:
            queryset = queryset.filter(service_id=service_filter)
        date_from = params.get('date_from')
        if date_from:
            try:
                date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
                queryset = queryset.filter(time_slot__date__gte=date_from)
            except ValueError:
                pass
        date_to = params.get('date_to')
        if date_to:
            try:
                date_to = datetime.strptime(date_to, '%Y-%m-%d').date()
                queryset = queryset.filter(time_slot__date__lte=date_to)
            except ValueError:
                pass
        search = params.get('search')
        if search:
            queryset = queryset.filter(
                Q(customer__first_name__icontains=search) |
                Q(customer__last_name__icontains=search) |
                Q(customer__email__icontains=search) |
                Q(customer__phone_number__icontains=search) |
                Q(car__make__icontains=search) |
                Q(car__model__icontains=search) |
                Q(car__license_plate__icontains=search) |
                Q(service__name__icontains=search) |
                Q(customer_notes__icontains=search)
            )
        queryset = queryset.order_by('-time_slot__date', '-time_slot__start_time')
        # Pagination
        page = int(params.get('page', 1))
        page_size = int(params.get('page_size', 10))
        start = (page - 1) * page_size
        end = start + page_size
        total_count = queryset.count()
        paginated_queryset = queryset[start:end]
        serializer = BookingListSerializer(paginated_queryset, many=True)
        return {
            'bookings': serializer.data,
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total_count': total_count,
                'total_pages': (total_count + page_size - 1) // page_size,
                'has_next': end < total_count,
                'has_previous': page > 1
            }
        }

    def get_booking_detail(self, pk):
        try:
            booking = Booking.objects.select_related('customer', 'car', 'service', 'assigned_staff').get(pk=pk)
            serializer = BookingDetailSerializer(booking)
            return serializer.data
        except Booking.DoesNotExist:
            return None

    def create_booking(self, data, request):
        serializer = BookingCreateSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            booking = serializer.save()
            response_serializer = BookingDetailSerializer(booking)
            return {
                'message': 'Booking created successfully',
                'booking': response_serializer.data
            }, None
        return None, serializer.errors

    def update_booking(self, pk, data, request):
        try:
            booking = Booking.objects.get(pk=pk)
            serializer = BookingUpdateSerializer(booking, data=data, context={'request': request})
            if serializer.is_valid():
                updated_booking = serializer.save()
                response_serializer = BookingDetailSerializer(updated_booking)
                return {
                    'message': 'Booking updated successfully',
                    'booking': response_serializer.data
                }, None
            return None, serializer.errors
        except Booking.DoesNotExist:
            return None, {'error': 'Booking not found'}

    def update_status(self, pk, status_value, notes, user):
        try:
            booking = Booking.objects.get(pk=pk)
            valid_statuses = [choice[0] for choice in Booking.STATUS_CHOICES]
            if status_value not in valid_statuses:
                return None, {'error': f'Invalid status. Valid options: {valid_statuses}'}
            old_status = booking.status
            booking.status = status_value
            booking.save()
            BookingStatusHistory.objects.create(
                booking=booking,
                old_status=old_status,
                new_status=status_value,
                changed_by=user if user and user.is_authenticated else None,
                change_reason=notes or f'Status changed from {old_status} to {status_value}'
            )
            serializer = BookingDetailSerializer(booking)
            return {
                'message': 'Booking status updated successfully',
                'booking': serializer.data
            }, None
        except Booking.DoesNotExist:
            return None, {'error': 'Booking not found'}

    def cancel_booking(self, pk, user, reason):
        try:
            booking = Booking.objects.get(pk=pk)
            if booking.status in ['completed', 'cancelled']:
                return None, {'error': f'Cannot cancel booking with status: {booking.status}'}
            old_status = booking.status
            booking.status = 'cancelled'
            booking.save()
            BookingStatusHistory.objects.create(
                booking=booking,
                old_status=old_status,
                new_status='cancelled',
                changed_by=user if user and user.is_authenticated else None,
                notes=reason or 'Booking cancelled'
            )
            return {'message': 'Booking cancelled successfully'}, None
        except Booking.DoesNotExist:
            return None, {'error': 'Booking not found'}

    def get_booking_stats(self):
        today = timezone.now().date()
        total_bookings = Booking.objects.count()
        completed_bookings = Booking.objects.filter(status='completed').count()
        pending_bookings = Booking.objects.filter(status__in=['pending', 'confirmed']).count()
        today_bookings = Booking.objects.filter(time_slot__date=today).count()
        stats_data = {
            'totalBookings': total_bookings,
            'completedBookings': completed_bookings,
            'pendingBookings': pending_bookings,
            'todayBookings': today_bookings
        }
        serializer = BookingStatsSerializer(stats_data)
        return serializer.data

    def get_customer_cars(self, customer_id):
        if not customer_id:
            return None, {'error': 'customer_id parameter is required'}
        try:
            customer = Customer.objects.get(pk=customer_id)
            cars = customer.cars.all()
            cars_data = []
            for car in cars:
                cars_data.append({
                    'id': car.id,
                    'make': car.make,
                    'model': car.model,
                    'year': car.year,
                    'license_plate': car.license_plate,
                    'color': car.color,
                    'display_name': f"{car.year} {car.make} {car.model} ({car.license_plate})"
                })
            return {'cars': cars_data}, None
        except Customer.DoesNotExist:
            return None, {'error': 'Customer not found'}

    def get_available_time_slots(self, date_param, exclude_booking_id):
        from workshop.models.booking import BookingTimeSlot
        from workshop.serializers.booking_serializer import BookingTimeSlotSerializer
        if not date_param:
            return None, {'error': 'Date parameter is required (format: YYYY-MM-DD)'}
        try:
            selected_date = datetime.strptime(date_param, '%Y-%m-%d').date()
            exclude_booking = None
            if exclude_booking_id:
                try:
                    exclude_booking = Booking.objects.get(id=exclude_booking_id)
                except Booking.DoesNotExist:
                    pass
            existing_slots = BookingTimeSlot.objects.filter(date=selected_date).exists()
            if not existing_slots:
                BookingTimeSlot.create_daily_slots(
                    date=selected_date,
                    start_hour=9,
                    end_hour=17,
                    slot_duration_minutes=60,
                    max_concurrent=1
                )
            available_slots = BookingTimeSlot.get_available_slots_for_date(selected_date, exclude_booking)
            slots_data = []
            for slot_info in available_slots:
                slot = slot_info['slot']
                available_count = slot_info['available_count']
                slots_data.append({
                    'id': str(slot.id),
                    'date': str(slot.date),
                    'start_time': slot.start_time.strftime('%H:%M'),
                    'end_time': slot.end_time.strftime('%H:%M'),
                    'available_slots': available_count,
                    'is_available': available_count > 0
                })
            return slots_data, None
        except ValueError:
            return None, {'error': 'Invalid date format. Use YYYY-MM-DD'}
        except Exception as e:
            return None, {'error': f'Error fetching time slots: {str(e)}'}
