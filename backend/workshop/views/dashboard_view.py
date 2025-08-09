# workshop/views/dashboard_view.py

from rest_framework import viewsets, status
from workshop.permissions import IsAdmin
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q, Avg
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from workshop.services.dashboard_service import DashboardService


class DashboardView(viewsets.ViewSet):
    
    permission_classes = [IsAdmin]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.dashboard_service = DashboardService()

    @action(detail=False, methods=['get'], url_path='stats')
    def get_stats(self, request):
        result, error = self.dashboard_service.get_stats()
        if result:
            return Response(result, status=status.HTTP_200_OK)
        return Response(error, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
