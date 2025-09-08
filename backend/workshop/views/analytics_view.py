import logging
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
import logging

from workshop.permissions import IsAdmin
from workshop.services.analytics_service import AnalyticsService
from workshop.serializers.analytics_serializer import (
    MonthlyRevenueSerializer,
    DailyBookingsSerializer,
    TopServicesSerializer,
    CarTypesSerializer,
    YearlyCarSerializer,
    ProfitableServicesSerializer,
    PopularServicesSerializer,
    TopSparePartsSerializer,
    AnalyticsMetricsSerializer,
    MonthlyReportSerializer,
)

logger = logging.getLogger(__name__)


class AnalyticsViewSet(ViewSet):
    
    # permission_classes = [IsAdmin]


    @action(detail=False, methods=['get'], url_path='data')
    def analytics(self, request):
        return Response(AnalyticsService.analytics(), status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='report/monthly')
    def get_monthly_report(self, request):
        """Get comprehensive monthly analytics report."""
        try:
            month = request.query_params.get('month', 'January')
            year = int(request.query_params.get('year', 2024))
            
            data = AnalyticsService.get_monthly_analytics_report(month, year)
            serializer = MonthlyReportSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            return Response(
                {"error": "Invalid year parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error getting monthly report: {str(e)}")
            return Response(
                {"error": "Failed to retrieve monthly report"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'], url_path='metrics')
    def get_metrics(self, request):
        try:
            data = AnalyticsService.get_analytics_metrics()
            serializer = AnalyticsMetricsSerializer(data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error getting analytics metrics: {str(e)}")
            return Response(
                {"error": "Failed to retrieve analytics metrics"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='revenue/monthly')
    def get_monthly_revenue(self, request):
        """Get monthly revenue data."""
        try:
            months = int(request.query_params.get('months', 12))
            data = AnalyticsService.get_monthly_revenue(months)
            serializer = MonthlyRevenueSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            return Response(
                {"error": "Invalid months parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error getting monthly revenue data: {str(e)}")
            return Response(
                {"error": "Failed to retrieve monthly revenue data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='bookings/daily')
    def get_daily_bookings(self, request):
        """Get daily bookings data."""
        try:
            days = int(request.query_params.get('days', 30))
            data = AnalyticsService.get_daily_bookings(days)
            serializer = DailyBookingsSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            return Response(
                {"error": "Invalid days parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error getting daily bookings data: {str(e)}")
            return Response(
                {"error": "Failed to retrieve daily bookings data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='services/top')
    def get_top_services(self, request):
        """Get top services data."""
        try:
            limit = int(request.query_params.get('limit', 10))
            data = AnalyticsService.get_top_services(limit)
            serializer = TopServicesSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            return Response(
                {"error": "Invalid limit parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error getting top services data: {str(e)}")
            return Response(
                {"error": "Failed to retrieve top services data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='cars/types')
    def get_car_types(self, request):
        """Get car types distribution data."""
        try:
            data = AnalyticsService.get_car_types_distribution()
            serializer = CarTypesSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error getting car types data: {str(e)}")
            return Response(
                {"error": "Failed to retrieve car types data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='cars/yearly')
    def get_yearly_cars(self, request):
        """Get yearly car distribution data."""
        try:
            data = AnalyticsService.get_yearly_car_distribution()
            serializer = YearlyCarSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error getting yearly car data: {str(e)}")
            return Response(
                {"error": "Failed to retrieve yearly car data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='services/profitable')
    def get_profitable_services(self, request):
        """Get profitable services data."""
        try:
            limit = int(request.query_params.get('limit', 10))
            data = AnalyticsService.get_profitable_services(limit)
            serializer = ProfitableServicesSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            return Response(
                {"error": "Invalid limit parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error getting profitable services data: {str(e)}")
            return Response(
                {"error": "Failed to retrieve profitable services data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='services/popular')
    def get_popular_services(self, request):
        """Get popular services data."""
        try:
            limit = int(request.query_params.get('limit', 10))
            data = AnalyticsService.get_popular_services(limit)
            serializer = PopularServicesSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            return Response(
                {"error": "Invalid limit parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error getting popular services data: {str(e)}")
            return Response(
                {"error": "Failed to retrieve popular services data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'], url_path='spare-parts/top')
    def get_top_spare_parts(self, request):
        """Get top spare parts data."""
        try:
            limit = int(request.query_params.get('limit', 10))
            data = AnalyticsService.get_top_spare_parts(limit)
            serializer = TopSparePartsSerializer(data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValueError:
            return Response(
                {"error": "Invalid limit parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error getting top spare parts data: {str(e)}")
            return Response(
                {"error": "Failed to retrieve top spare parts data"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], url_path='cache/clear')
    def clear_cache(self, request):
        """Clear analytics cache."""
        try:
            AnalyticsService.clear_analytics_cache()
            return Response(
                {"message": "Analytics cache cleared successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Error clearing analytics cache: {str(e)}")
            return Response(
                {"error": "Failed to clear analytics cache"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
