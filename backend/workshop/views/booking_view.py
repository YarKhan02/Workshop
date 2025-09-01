# workshop/views/booking_view.py
from rest_framework import viewsets, status
from workshop.permissions import IsAdmin, IsCustomer
from rest_framework.decorators import action
from rest_framework.response import Response

from workshop.services.booking_service import BookingService

class BookingView(viewsets.ViewSet):
    
    def get_permissions(self):
        if self.action in ['create_customer_booking', 'get_available_dates']:  
            permission_classes = [IsCustomer]
        else:
            permission_classes = [IsAdmin]
        return [perm() for perm in permission_classes]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.booking_service = BookingService()
    
    # List all bookings
    @action(detail=False, methods=['get'], url_path='list')
    def get_bookings(self, request):
        result = self.booking_service.get_bookings(request.query_params)
        return Response(result)
    
    
    @action(detail=True, methods=['get'], url_path='detail')
    def get_booking_detail(self, request, pk=None):
        data = self.booking_service.get_booking_detail(pk)
        if data:
            return Response(data)
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
    

    @action(detail=True, methods=['get'], url_path='invoice-items')
    def get_booking_invoice_items(self, request, pk=None):
        data = self.booking_service.get_booking_invoice_items(pk)
        if data:
            return Response(data)
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)


    # Create a new booking
    @action(detail=False, methods=['post'], url_path='create')
    def create_booking(self, request):
        print("Creating booking with data:", request.data)
        result, errors = self.booking_service.create_booking(request.data, request)
        print('===', result)
        if result:
            try:
                return Response(result, status=status.HTTP_201_CREATED)
            except Exception as e:
                import traceback
                print('Serializer or response error:', e)
                traceback.print_exc()
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    @action(detail=False, methods=['post'], url_path='create-customer')
    def create_customer_booking(self, request):
        print("Received booking request data:", request.data)
        result, errors = self.booking_service.create_customer_booking(request.data, request)
        if result:
            return Response(result, status=status.HTTP_201_CREATED)
        print("Booking creation failed with errors:", errors)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)


    # Update an existing booking
    @action(detail=True, methods=['put'], url_path='update')
    def update_booking(self, request, pk=None):
        result, errors = self.booking_service.update_booking(pk, request.data, request)
        if result:
            return Response(result)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    # Update status of booking
    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        new_status = request.data.get('status')
        if not new_status:
            return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)
        result, errors = self.booking_service.update_status(pk, new_status)
        if errors:
            return Response({"result": result, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"result": result, "errors": errors}, status=status.HTTP_200_OK)
    
    
    @action(detail=True, methods=['delete'], url_path='cancel')
    def cancel_booking(self, request, pk=None):
        reason = request.data.get('reason', 'Booking cancelled')
        result, errors = self.booking_service.cancel_booking(pk, request.user, reason)
        if errors:
            return Response({"result": result, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"result": result, "errors": errors}, status=status.HTTP_200_OK)
    
    
    @action(detail=False, methods=['get'], url_path='stats')
    def get_booking_stats(self, request):
        result = self.booking_service.get_booking_stats()
        return Response(result)
    
    
    @action(detail=False, methods=['get'], url_path='customer-cars')
    def get_customer_cars(self, request):
        customer_id = request.query_params.get('customer_id')
        result, errors = self.booking_service.get_customer_cars(customer_id)
        if result:
            return Response(result)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    
    # Get available dates for booking
    @action(detail=False, methods=['get'], url_path='available-dates')
    def get_available_dates(self, request):
        start_date = request.query_params.get('start_date')
        days = int(request.query_params.get('days', 14))
        result, errors = self.booking_service.get_available_dates(start_date, days)
        if result is not None:
            return Response(result)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    
    @action(detail=False, methods=['get'], url_path='availability')
    def get_date_availability(self, request):
        date_param = request.query_params.get('date')
        result, errors = self.booking_service.get_availability_for_date(date_param)
        if result:
            return Response(result)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
