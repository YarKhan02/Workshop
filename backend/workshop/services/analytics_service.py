import logging
from typing import List, Dict, Any, Optional
from django.core.cache import cache
from django.conf import settings
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from workshop.models import Invoice, BookingService, PaySlip, Expense, Booking, InvoiceItems
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
    def get_monthly_analytics_report(cls, month: str, year: int) -> Dict[str, Any]:
        """
        Generate comprehensive monthly analytics report
        
        Args:
            month: Month name (e.g., 'January', 'February')
            year: Year (e.g., 2024)
        
        Returns:
            Dict containing all analytics data for the month
        """
        cache_key = f"analytics_monthly_report_{year}_{month}"
        
        try:
            # Try to get from cache first
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                logger.info(f"Retrieved monthly report from cache for {month} {year}")
                return cached_data
            
            # Convert month name to number
            month_mapping = {
                'January': 1, 'February': 2, 'March': 3, 'April': 4,
                'May': 5, 'June': 6, 'July': 7, 'August': 8,
                'September': 9, 'October': 10, 'November': 11, 'December': 12
            }
            month_num = month_mapping.get(month, 1)
            
            # Calculate date range for the month
            start_date = datetime(year, month_num, 1)
            if month_num == 12:
                end_date = datetime(year + 1, 1, 1) - timedelta(days=1)
            else:
                end_date = datetime(year, month_num + 1, 1) - timedelta(days=1)
            
            # Total Bookings
            total_bookings = Booking.objects.filter(
                created_at__year=year,
                created_at__month=month_num
            ).count()
            
            # Completed Bookings
            completed_bookings = BookingService.objects.filter(
                booking__created_at__year=year,
                booking__created_at__month=month_num,
                status='completed'
            ).count()
            
            # Total Sales (Paid Invoices)
            total_sales = Invoice.objects.filter(
                created_at__year=year,
                created_at__month=month_num,
                status='paid'
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            # Products Used in Services (Cost)
            products_used_cost = BookingService.objects.filter(
                booking__created_at__year=year,
                booking__created_at__month=month_num,
                status='completed'
            ).aggregate(total=Sum('product_items_price'))['total'] or 0
            
            # Products Sold (Individual sales)
            products_sold = InvoiceItems.objects.filter(
                booking_service__booking__created_at__year=year,
                booking_service__booking__created_at__month=month_num
            ).aggregate(
                total_quantity=Sum('quantity'),
                total_value=Sum('total_amount')
            )
            
            # Product Details (with names)
            product_sales_details = InvoiceItems.objects.filter(
                booking_service__booking__created_at__year=year,
                booking_service__booking__created_at__month=month_num
            ).values(
                'product_variant__product__name',
                'product_variant__variant_name',
                'product_variant__sku'
            ).annotate(
                total_quantity=Sum('quantity'),
                total_revenue=Sum('total_amount'),
                unit_price=Sum('unit_price')
            ).order_by('-total_revenue')[:10]
            
            # Service Revenue (Service charges only)
            service_revenue = BookingService.objects.filter(
                booking__created_at__year=year,
                booking__created_at__month=month_num,
                status='completed'
            ).aggregate(total=Sum('price'))['total'] or 0
            
            # Employee Salaries
            employee_salaries = PaySlip.objects.filter(
                month__startswith=f"{year}-{month_num:02d}"
            ).aggregate(total=Sum('total_salary'))['total'] or 0
            
            # Expenses
            total_expenses = Expense.objects.filter(
                paid_on__year=year,
                paid_on__month=month_num
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            # Calculate Revenue and Profit
            gross_revenue = float(total_sales)
            net_revenue = gross_revenue - float(products_used_cost)
            total_profit = net_revenue - float(employee_salaries) - float(total_expenses)
            
            # Top Services
            top_services = BookingService.objects.filter(
                booking__created_at__year=year,
                booking__created_at__month=month_num
            ).values('service__name').annotate(
                count=Count('id'),
                revenue=Sum('price')
            ).order_by('-count')[:5]
            
            # Expense Breakdown
            expense_breakdown = Expense.objects.filter(
                paid_on__year=year,
                paid_on__month=month_num
            ).values('category').annotate(
                total=Sum('amount'),
                count=Count('id')
            ).order_by('-total')
            
            report_data = {
                'period': {
                    'month': month,
                    'year': year,
                    'start_date': start_date.strftime('%Y-%m-%d'),
                    'end_date': end_date.strftime('%Y-%m-%d')
                },
                'bookings': {
                    'total_bookings': total_bookings,
                    'completed_bookings': completed_bookings,
                    'completion_rate': round((completed_bookings / total_bookings * 100) if total_bookings > 0 else 0, 2)
                },
                'financial': {
                    'total_sales': float(total_sales),
                    'service_revenue': float(service_revenue),
                    'products_used_cost': float(products_used_cost),
                    'gross_revenue': gross_revenue,
                    'net_revenue': net_revenue,
                    'employee_salaries': float(employee_salaries),
                    'total_expenses': float(total_expenses),
                    'total_profit': total_profit,
                    'profit_margin': round((total_profit / gross_revenue * 100) if gross_revenue > 0 else 0, 2)
                },
                'products': {
                    'products_sold_quantity': float(products_sold['total_quantity'] or 0),
                    'products_sold_value': float(products_sold['total_value'] or 0),
                    'products_used_in_services': float(products_used_cost),
                    'product_sales_details': [
                        {
                            'product_name': item['product_variant__product__name'],
                            'variant_name': item['product_variant__variant_name'],
                            'sku': item['product_variant__sku'],
                            'quantity_sold': float(item['total_quantity'] or 0),
                            'revenue': float(item['total_revenue'] or 0),
                            'unit_price': float(item['unit_price'] or 0)
                        }
                        for item in product_sales_details
                    ]
                },
                'top_services': [
                    {
                        'service_name': item['service__name'],
                        'bookings_count': item['count'],
                        'revenue': float(item['revenue'] or 0)
                    }
                    for item in top_services
                ],
                'expense_breakdown': [
                    {
                        'category': item['category'],
                        'total_amount': float(item['total']),
                        'transaction_count': item['count']
                    }
                    for item in expense_breakdown
                ],
                'generated_at': timezone.now().isoformat()
            }
            
            # Cache the result
            cache.set(cache_key, report_data, cls.CACHE_TIMEOUT)
            logger.info(f"Generated and cached monthly report for {month} {year}")
            
            return report_data
            
        except Exception as e:
            logger.error(f"Error generating monthly analytics report: {str(e)}")
            return {}

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
