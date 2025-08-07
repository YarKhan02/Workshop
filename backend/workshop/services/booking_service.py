# workshop/services/booking_service.py
from workshop.models.booking import Booking, BookingStatusHistory, BookingAdditionalService
from workshop.models.customer import Customer
from workshop.models.car import Car
from workshop.models.daily_availability import DailyAvailability
from workshop.serializers.booking_serializer import (
    BookingListSerializer, BookingDetailSerializer, 
    BookingCreateSerializer, BookingUpdateSerializer,
    BookingStatsSerializer
)
from workshop.queries import booking_queries as bq
from workshop.queries import daily_availability_queries as daq
from workshop.helper.booking_helpers import (
    handle_booking_status_change, 
    is_booking_cancellable
)
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, date, timedelta

class BookingService:
    def get_bookings(self, params):
        """
        Get optimized bookings list using query optimization
        """
        # Prepare filters
        filters = {}
        if params.get('status'):
            filters['status'] = params['status']
        if params.get('customer'):
            filters['customer'] = params['customer']
        if params.get('service'):
            filters['service'] = params['service']
        if params.get('date_from'):
            filters['date_from'] = params['date_from']
        if params.get('date_to'):
            filters['date_to'] = params['date_to']
        if params.get('search'):
            filters['search'] = params['search']
        
        # Get pagination parameters
        page = int(params.get('page', 1))
        page_size = int(params.get('page_size', 10))
        
        # Use optimized query
        result = bq.get_optimized_bookings(filters, page, page_size)
        
        # Serialize the results
        serializer = BookingListSerializer(result['queryset'], many=True)
        
        return {
            'bookings': serializer.data,
            'pagination': result['pagination']
        }

    def get_booking_detail(self, pk):
        """
        Get optimized booking detail
        """
        booking = bq.get_optimized_booking_detail(pk)
        if booking:
            serializer = BookingDetailSerializer(booking)
            return serializer.data
        return None

    def create_booking(self, data, request):
        """
        Create booking with optimized queries
        """
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
        """
        Update booking with optimized queries
        """
        booking = bq.get_booking_for_update(pk)
        if not booking:
            return None, {'error': 'Booking not found'}
            
        serializer = BookingUpdateSerializer(booking, data=data, context={'request': request})
        if serializer.is_valid():
            updated_booking = serializer.save()
            response_serializer = BookingDetailSerializer(updated_booking)
            return {
                'message': 'Booking updated successfully',
                'booking': response_serializer.data
            }, None
        return None, serializer.errors

    def update_status(self, pk, status_value, notes, user):
        """
        Update booking status with time slot availability handling
        """
        booking = bq.get_booking_for_update(pk)
        if not booking:
            return None, {'error': 'Booking not found'}

        # Validate status
        valid_statuses = [choice[0] for choice in Booking.STATUS_CHOICES]
        if status_value not in valid_statuses:
            return None, {'error': f'Invalid status. Valid options: {valid_statuses}'}

        old_status = booking.status
        
        # Use helper function to handle status change and time slot availability
        updated_booking = handle_booking_status_change(
            booking, old_status, status_value, user, notes or f'Status changed from {old_status} to {status_value}'
        )
        
        response_serializer = BookingDetailSerializer(updated_booking)
        return {
            'message': 'Booking status updated successfully',
            'booking': response_serializer.data
        }, None

    def cancel_booking(self, pk, user, reason):
        """
        Cancel booking with time slot availability handling
        """
        booking = bq.get_booking_for_update(pk)
        if not booking:
            return None, {'error': 'Booking not found'}
            
        if not is_booking_cancellable(booking):
            return None, {'error': f'Cannot cancel booking with status: {booking.status}'}
        
        # Use helper function to handle cancellation
        cancelled_booking = handle_booking_status_change(
            booking, booking.status, 'cancelled', user, reason or 'Booking cancelled'
        )
        
        return {'message': 'Booking cancelled successfully'}, None

    def get_booking_stats(self):
        """
        Get optimized booking statistics
        """
        return bq.get_booking_stats()

    def get_customer_cars(self, customer_id):
        """
        Get optimized customer cars
        """
        result = bq.get_customer_cars_optimized(customer_id)
        if result:
            return result, None
        return None, {'error': 'Customer not found or no cars available'}

    def get_available_dates(self, start_date=None, days=14):
        """
        Get available dates for booking (next 14 days by default)
        """
        try:
            if start_date:
                if isinstance(start_date, str):
                    start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            else:
                start_date = date.today()
            
            # Get available dates using optimized query
            available_dates = daq.get_available_dates_optimized(start_date, days)
            
            return available_dates, None
            
        except ValueError:
            return None, {'error': 'Invalid date format. Use YYYY-MM-DD'}
        except Exception as e:
            return None, {'error': f'Error fetching available dates: {str(e)}'}

    def get_availability_for_date(self, date_param):
        """
        Get availability info for a specific date
        """
        if not date_param:
            return None, {'error': 'Date parameter is required (format: YYYY-MM-DD)'}
            
        try:
            availability = daq.get_availability_for_date(date_param)
            if availability:
                return availability, None
            return None, {'error': 'Date not found or not available'}
            
        except ValueError:
            return None, {'error': 'Invalid date format. Use YYYY-MM-DD'}
        except Exception as e:
            return None, {'error': f'Error fetching availability: {str(e)}'}