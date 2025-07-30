# workshop/views/booking_view.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import datetime, date
from decimal import Decimal

from workshop.models.booking import Booking, BookingStatusHistory, BookingAdditionalService
from workshop.models.customer import Customer
from workshop.models.car import Car
from workshop.serializers.booking_serializer import (
    BookingListSerializer, BookingDetailSerializer, 
    BookingCreateSerializer, BookingUpdateSerializer,
    BookingStatsSerializer
)


class BookingView(viewsets.ViewSet):
    
    @action(detail=False, methods=['get'], url_path='list')
    def get_bookings(self, request):
        queryset = Booking.objects.select_related('customer', 'car', 'service', 'assigned_staff').all()
        
        # Apply filters
        status_filter = request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        customer_filter = request.query_params.get('customer', None)
        if customer_filter:
            queryset = queryset.filter(customer_id=customer_filter)
        
        service_filter = request.query_params.get('service', None)
        if service_filter:
            queryset = queryset.filter(service_id=service_filter)
        
        date_from = request.query_params.get('date_from', None)
        if date_from:
            try:
                date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
                queryset = queryset.filter(time_slot__date__gte=date_from)
            except ValueError:
                pass
        
        date_to = request.query_params.get('date_to', None)
        if date_to:
            try:
                date_to = datetime.strptime(date_to, '%Y-%m-%d').date()
                queryset = queryset.filter(time_slot__date__lte=date_to)
            except ValueError:
                pass
        
        search = request.query_params.get('search', None)
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
        
        # Ordering
        queryset = queryset.order_by('-time_slot__date', '-time_slot__start_time')
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        start = (page - 1) * page_size
        end = start + page_size
        
        total_count = queryset.count()
        paginated_queryset = queryset[start:end]
        
        serializer = BookingListSerializer(paginated_queryset, many=True)
        
        return Response({
            'bookings': serializer.data,
            'pagination': {
                'page': page,
                'page_size': page_size,
                'total_count': total_count,
                'total_pages': (total_count + page_size - 1) // page_size,
                'has_next': end < total_count,
                'has_previous': page > 1
            }
        })
    
    @action(detail=True, methods=['get'], url_path='detail')
    def get_booking_detail(self, request, pk=None):
        """
        Get detailed booking information
        GET: /bookings/{id}/detail/
        """
        try:
            booking = Booking.objects.select_related('customer', 'car', 'service', 'assigned_staff').get(pk=pk)
            serializer = BookingDetailSerializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], url_path='create')
    def create_booking(self, request):
        """
        Create a new booking
        POST: /bookings/create/
        """
        serializer = BookingCreateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            booking = serializer.save()
            response_serializer = BookingDetailSerializer(booking)
            return Response(
                {
                    "message": "Booking created successfully", 
                    "booking": response_serializer.data
                }, 
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'], url_path='update')
    def update_booking(self, request, pk=None):
        """
        Update an existing booking
        PUT: /bookings/{id}/update/
        """
        try:
            booking = Booking.objects.get(pk=pk)
            print(f"Updating booking {pk} with data: {request.data}")
            serializer = BookingUpdateSerializer(booking, data=request.data, context={'request': request})
            
            if serializer.is_valid():
                updated_booking = serializer.save()
                response_serializer = BookingDetailSerializer(updated_booking)
                return Response(
                    {
                        "message": "Booking updated successfully", 
                        "booking": response_serializer.data
                    }
                )
            
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        """
        Update booking status only
        PATCH: /bookings/{id}/status/
        Body: {"status": "confirmed", "notes": "Optional notes"}
        """
        try:
            booking = Booking.objects.get(pk=pk)
            new_status = request.data.get('status')
            notes = request.data.get('notes', '')
            
            if not new_status:
                return Response(
                    {"error": "Status is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            valid_statuses = [choice[0] for choice in Booking.STATUS_CHOICES]
            if new_status not in valid_statuses:
                return Response(
                    {"error": f"Invalid status. Valid options: {valid_statuses}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            old_status = booking.status
            booking.status = new_status
            booking.save()
            
            # Create status history
            BookingStatusHistory.objects.create(
                booking=booking,
                old_status=old_status,
                new_status=new_status,
                changed_by=request.user if request.user.is_authenticated else None,
                change_reason=notes or f"Status changed from {old_status} to {new_status}"
            )
            
            serializer = BookingDetailSerializer(booking)
            return Response(
                {
                    "message": "Booking status updated successfully", 
                    "booking": serializer.data
                }
            )
            
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['delete'], url_path='cancel')
    def cancel_booking(self, request, pk=None):
        """
        Cancel a booking (soft delete by changing status)
        DELETE: /bookings/{id}/cancel/
        """
        try:
            booking = Booking.objects.get(pk=pk)
            
            if booking.status in ['completed', 'cancelled']:
                return Response(
                    {"error": f"Cannot cancel booking with status: {booking.status}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            old_status = booking.status
            booking.status = 'cancelled'
            booking.save()
            
            # Create status history
            BookingStatusHistory.objects.create(
                booking=booking,
                old_status=old_status,
                new_status='cancelled',
                changed_by=request.user if request.user.is_authenticated else None,
                notes=request.data.get('reason', 'Booking cancelled')
            )
            
            return Response({"message": "Booking cancelled successfully"})
            
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], url_path='stats')
    def get_booking_stats(self, request):
        today = timezone.now().date()
        
        # Get total counts
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
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='customer-cars')
    def get_customer_cars(self, request):
        """
        Get cars for a specific customer (for booking creation)
        GET: /bookings/customer-cars/?customer_id={uuid}
        """
        customer_id = request.query_params.get('customer_id')
        if not customer_id:
            return Response(
                {"error": "customer_id parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
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
            
            return Response({'cars': cars_data})
            
        except Customer.DoesNotExist:
            return Response(
                {"error": "Customer not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'], url_path='available-slots')
    def get_available_time_slots(self, request):
        """
        Get available time slots for a specific date
        GET: /bookings/available-slots/?date=YYYY-MM-DD&exclude_booking=booking_id
        """
        from workshop.models.booking import BookingTimeSlot
        from workshop.serializers.booking_serializer import BookingTimeSlotSerializer
        
        date_param = request.query_params.get('date')
        exclude_booking_id = request.query_params.get('exclude_booking')
        
        if not date_param:
            return Response(
                {"error": "Date parameter is required (format: YYYY-MM-DD)"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Parse the date
            selected_date = datetime.strptime(date_param, '%Y-%m-%d').date()
            
            # Get booking to exclude if provided
            exclude_booking = None
            if exclude_booking_id:
                try:
                    exclude_booking = Booking.objects.get(id=exclude_booking_id)
                except Booking.DoesNotExist:
                    pass  # Continue without excluding any booking
            
            # Check if time slots exist for this date, if not create them
            existing_slots = BookingTimeSlot.objects.filter(date=selected_date).exists()
            if not existing_slots:
                # Create default time slots for this date (9 AM to 5 PM, 1-hour slots)
                BookingTimeSlot.create_daily_slots(
                    date=selected_date,
                    start_hour=9,
                    end_hour=17,
                    slot_duration_minutes=60,
                    max_concurrent=1
                )
            
            # Get available time slots for the date (excluding current booking if provided)
            available_slots = BookingTimeSlot.get_available_slots_for_date(selected_date, exclude_booking)
            
            # Serialize the time slots
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
            
            return Response(slots_data)
            
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Error fetching time slots: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
