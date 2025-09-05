import logging
from typing import List, Dict, Any, Optional
from django.core.cache import cache
from django.conf import settings
from django.db.models import Sum
from workshop.models import Invoice, BookingService, PaySlip, Expense

from workshop.queries.analytics_queries import AnalyticsQueries

logger = logging.getLogger(__name__)


class AnalyticsService:
    
    CACHE_TIMEOUT = 300


    def analytics():
        total_sales = Invoice.objects.filter(status='paid').aggregate(total=Sum('total_amount'))['total'] or 0
        print('================', total_sales)
        products_used = BookingService.objects.filter(status='completed').aggregate(total=Sum('product_items_price'))['total'] or 0
        print('================', products_used)
        sales_revenue = total_sales - products_used
        print('================', sales_revenue)
        employee_salary = PaySlip.objects.aggregate(total=Sum('total_salary'))['total'] or 0
        print('================', employee_salary)
        expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0
        print('================', expenses)
        total_revenue = sales_revenue - employee_salary - expenses
        return total_sales, products_used, sales_revenue, total_revenue

    @classmethod
    def get_monthly_revenue(cls, months: int = 12) -> List[Dict[str, Any]]:
        cache_key = f"analytics_monthly_revenue_{months}"
        
        try:
            # Try to get from cache first
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info(f"Retrieved monthly revenue data from cache for {months} months")
                return cached_data
            
            # If not in cache, get from database
            data = AnalyticsQueries.get_monthly_revenue(months)
            
            # Cache the result
            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            logger.info(f"Cached monthly revenue data for {months} months")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting monthly revenue data: {str(e)}")
            return []
    
    @classmethod
    def get_daily_bookings(cls, days: int = 30) -> List[Dict[str, Any]]:
        cache_key = f"analytics_daily_bookings_{days}"
        
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info(f"Retrieved daily bookings data from cache for {days} days")
                return cached_data
            
            data = AnalyticsQueries.get_daily_bookings(days)
            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            logger.info(f"Cached daily bookings data for {days} days")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting daily bookings data: {str(e)}")
            return []
    
    @classmethod
    def get_top_services(cls, limit: int = 10) -> List[Dict[str, Any]]:
        cache_key = f"analytics_top_services_{limit}"
        
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info(f"Retrieved top services data from cache (limit: {limit})")
                return cached_data
            
            data = AnalyticsQueries.get_top_services(limit)
            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            logger.info(f"Cached top services data (limit: {limit})")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting top services data: {str(e)}")
            return []
    
    @classmethod
    def get_car_types_distribution(cls) -> List[Dict[str, Any]]:
        cache_key = "analytics_car_types_distribution"
        
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info("Retrieved car types distribution data from cache")
                return cached_data
            
            data = AnalyticsQueries.get_car_types_distribution()
            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            logger.info("Cached car types distribution data")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting car types distribution data: {str(e)}")
            return []
    
    @classmethod
    def get_yearly_car_distribution(cls) -> List[Dict[str, Any]]:
        cache_key = "analytics_yearly_car_distribution"
        
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info("Retrieved yearly car distribution data from cache")
                return cached_data
            
            data = AnalyticsQueries.get_yearly_car_distribution()
            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            logger.info("Cached yearly car distribution data")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting yearly car distribution data: {str(e)}")
            return []
    
    @classmethod
    def get_profitable_services(cls, limit: int = 10) -> List[Dict[str, Any]]:
        cache_key = f"analytics_profitable_services_{limit}"
        
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info(f"Retrieved profitable services data from cache (limit: {limit})")
                return cached_data
            
            data = AnalyticsQueries.get_profitable_services(limit)
            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            logger.info(f"Cached profitable services data (limit: {limit})")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting profitable services data: {str(e)}")
            return []
    
    @classmethod
    def get_popular_services(cls, limit: int = 10) -> List[Dict[str, Any]]:
        cache_key = f"analytics_popular_services_{limit}"
        
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info(f"Retrieved popular services data from cache (limit: {limit})")
                return cached_data
            
            data = AnalyticsQueries.get_popular_services(limit)
            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            logger.info(f"Cached popular services data (limit: {limit})")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting popular services data: {str(e)}")
            return []
    
    @classmethod
    def get_top_spare_parts(cls, limit: int = 10) -> List[Dict[str, Any]]:
        cache_key = f"analytics_top_spare_parts_{limit}"
        
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info(f"Retrieved top spare parts data from cache (limit: {limit})")
                return cached_data
            
            data = AnalyticsQueries.get_top_spare_parts(limit)
            cache.set(cache_key, data, cls.CACHE_TIMEOUT)
            logger.info(f"Cached top spare parts data (limit: {limit})")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting top spare parts data: {str(e)}")
            return []
    
    @classmethod
    def get_analytics_metrics(cls) -> Dict[str, Any]:
        cache_key = "analytics_metrics"
        
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info("Retrieved analytics metrics data from cache")
                return cached_data
            
            data = AnalyticsQueries.get_analytics_metrics()
            
            # Use shorter cache timeout for metrics (2 minutes) as they change more frequently
            cache.set(cache_key, data, 120)
            logger.info("Cached analytics metrics data")
            
            return data
            
        except Exception as e:
            logger.error(f"Error getting analytics metrics data: {str(e)}")
            return {
                'monthlyRevenue': 0,
                'totalBookings': 0,
                'activeVehicles': 0,
                'servicesCompleted': 0,
                'revenueChange': 0,
                'bookingsChange': 0,
                'vehiclesChange': 0,
                'servicesChange': 0,
            }
    
    @classmethod
    def clear_analytics_cache(cls) -> None:
        try:
            cache_keys = [
                'analytics_monthly_revenue_*',
                'analytics_daily_bookings_*',
                'analytics_top_services_*',
                'analytics_car_types_distribution',
                'analytics_yearly_car_distribution',
                'analytics_profitable_services_*',
                'analytics_popular_services_*',
                'analytics_top_spare_parts_*',
                'analytics_metrics',
            ]
            
            # Note: Django's cache doesn't support wildcard deletion
            # You might need to implement a more sophisticated cache invalidation strategy
            cache.clear()
            logger.info("Cleared all analytics cache data")
            
        except Exception as e:
            logger.error(f"Error clearing analytics cache: {str(e)}")
