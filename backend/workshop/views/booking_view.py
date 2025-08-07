# workshop/views/booking_view.py
from rest_framework import viewsets, status
from workshop.permissions.is_admin import IsAdmin
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import datetime, date
from decimal import Decimal

from workshop.services.booking_service import BookingService

class BookingView(viewsets.ViewSet):
    
    permission_classes = [IsAdmin]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.booking_service = BookingService()
    
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
    
    @action(detail=False, methods=['post'], url_path='create')
    def create_booking(self, request):
        print("Creating booking with data:", request.data)
        result, errors = self.booking_service.create_booking(request.data, request)
        if result:
            return Response(result, status=status.HTTP_201_CREATED)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'], url_path='update')
    def update_booking(self, request, pk=None):
        result, errors = self.booking_service.update_booking(pk, request.data, request)
        if result:
            return Response(result)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')
        if not new_status:
            return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)
        result, errors = self.booking_service.update_status(pk, new_status, notes, request.user)
        if result:
            return Response(result)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], url_path='cancel')
    def cancel_booking(self, request, pk=None):
        reason = request.data.get('reason', 'Booking cancelled')
        result, errors = self.booking_service.cancel_booking(pk, request.user, reason)
        if result:
            return Response(result)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
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
