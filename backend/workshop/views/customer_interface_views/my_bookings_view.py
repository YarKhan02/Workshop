from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from workshop.permissions.role_permissions import IsCustomer

from workshop.services import MyBookingsService

class MyBookingsView(viewsets.ViewSet):

    permission_classes = [IsCustomer]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.booking_service = MyBookingsService()

    @action(detail=False, methods=['get'], url_path='my-bookings')
    def get_my_bookings(self, request):
        # Use request.user which should be a Customer instance
        customer = request.user
        bookings = self.booking_service.get_my_bookings(customer)
        return Response(bookings)