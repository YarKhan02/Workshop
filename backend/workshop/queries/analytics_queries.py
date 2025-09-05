from datetime import datetime, timedelta
from django.db.models import Count, Sum, Avg, Q
from django.db.models.functions import TruncMonth, TruncDate
from django.utils import timezone
from typing import List, Dict, Any

from workshop.models import (
    Invoice, 
    Booking, 
    Car, 
    Service,
    BookingService,
    Product,
    StockMovement,
    Payment,
    PaySlip,
    Expense
)


class AnalyticsQueries:
    """Analytics queries for dashboard metrics and charts."""
    
    @staticmethod
    def get_monthly_revenue(months: int = 12) -> List[Dict[str, Any]]:
        """Get monthly revenue data for the last N months."""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=months * 30)
        
        revenue_data = Invoice.objects.filter(
            created_at__gte=start_date,
            status='paid'
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            revenue=Sum('total_amount')
        ).order_by('month')
        
        return [
            {
                'month': item['month'].strftime('%Y-%m'),
                'revenue': float(item['revenue'] or 0)
            }
            for item in revenue_data
        ]
    
    @staticmethod
    def get_daily_bookings(days: int = 30) -> List[Dict[str, Any]]:
        """Get daily booking counts for the last N days."""
        end_date = timezone.now()
        start_date = end_date - timedelta(days=days)
        
        bookings_data = Booking.objects.filter(
            created_at__gte=start_date
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        return [
            {
                'date': item['date'].strftime('%Y-%m-%d'),
                'count': item['count']
            }
            for item in bookings_data
        ]
    
    @staticmethod
    def get_top_services(limit: int = 10) -> List[Dict[str, Any]]:
        """Get most requested services."""
        services_data = BookingService.objects.values(
            'service__name'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:limit]
        
        return [
            {
                'service': item['service__name'],
                'count': item['count']
            }
            for item in services_data
        ]
    
    @staticmethod
    def get_car_types_distribution() -> List[Dict[str, Any]]:
        """Get distribution of car types in the system."""
        car_types_data = Car.objects.values(
            'car_type'
        ).annotate(
            count=Count('id')
        ).order_by('-count')
        
        return [
            {
                'type': item['car_type'] or 'Unknown',
                'count': item['count']
            }
            for item in car_types_data
        ]
    
    @staticmethod
    def get_yearly_car_distribution() -> List[Dict[str, Any]]:
        """Get distribution of cars by year."""
        yearly_data = Car.objects.filter(
            year__isnull=False
        ).values('year').annotate(
            count=Count('id')
        ).order_by('year')
        
        return [
            {
                'year': item['year'],
                'count': item['count']
            }
            for item in yearly_data
        ]
    
    @staticmethod
    def get_profitable_services(limit: int = 10) -> List[Dict[str, Any]]:
        """Get most profitable services by total revenue."""
        profitable_services = BookingService.objects.values(
            'service__name'
        ).annotate(
            revenue=Sum('total_price')
        ).order_by('-revenue')[:limit]
        
        return [
            {
                'service': item['service__name'],
                'revenue': float(item['revenue'] or 0)
            }
            for item in profitable_services
        ]
    
    @staticmethod
    def get_popular_services(limit: int = 10) -> List[Dict[str, Any]]:
        """Get most popular services by booking frequency."""
        popular_services = BookingService.objects.values(
            'service__name'
        ).annotate(
            count=Count('booking_id', distinct=True)
        ).order_by('-count')[:limit]
        
        return [
            {
                'service': item['service__name'],
                'count': item['count']
            }
            for item in popular_services
        ]
    
    @staticmethod
    def get_top_spare_parts(limit: int = 10) -> List[Dict[str, Any]]:
        """Get most used spare parts from stock movements."""
        spare_parts_data = StockMovement.objects.filter(
            movement_type='out'
        ).values(
            'product__name'
        ).annotate(
            count=Sum('quantity')
        ).order_by('-count')[:limit]
        
        return [
            {
                'part': item['product__name'],
                'count': int(item['count'] or 0)
            }
            for item in spare_parts_data
        ]
    
    @staticmethod
    def get_analytics_metrics() -> Dict[str, Any]:
        """Get key metrics for analytics dashboard."""
        now = timezone.now()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        
        # Current month metrics
        current_month_revenue = Invoice.objects.filter(
            created_at__gte=current_month_start,
            status='paid'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        current_month_bookings = Booking.objects.filter(
            created_at__gte=current_month_start
        ).count()

        # Last month metrics for comparison
        last_month_revenue = Invoice.objects.filter(
            created_at__gte=last_month_start,
            created_at__lt=current_month_start,
            status='paid'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        last_month_bookings = Booking.objects.filter(
            created_at__gte=last_month_start,
            created_at__lt=current_month_start
        ).count()

        # Calculate percentage changes
        revenue_change = 0
        if last_month_revenue > 0:
            revenue_change = ((current_month_revenue - last_month_revenue) / last_month_revenue) * 100
        
        bookings_change = 0
        if last_month_bookings > 0:
            bookings_change = ((current_month_bookings - last_month_bookings) / last_month_bookings) * 100

        # Active vehicles (cars with recent bookings)
        active_vehicles = Car.objects.filter(
            bookings__created_at__gte=now - timedelta(days=30)
        ).distinct().count()

        # Services completed this month
        services_completed = BookingService.objects.filter(
            booking__created_at__gte=current_month_start
        ).count()

        # Previous month services for comparison
        last_month_services = BookingService.objects.filter(
            booking__created_at__gte=last_month_start,
            booking__created_at__lt=current_month_start
        ).count()

        services_change = 0
        if last_month_services > 0:
            services_change = ((services_completed - last_month_services) / last_month_services) * 100

        # Calculate additional metrics
        total_sales = Invoice.objects.filter(status='paid').aggregate(total=Sum('total_amount'))['total'] or 0
        products_used = BookingService.objects.filter(status='completed').aggregate(total=Sum('product_items_price'))['total'] or 0
        sales_revenue = total_sales - products_used
        employee_salary = PaySlip.objects.aggregate(total=Sum('total_salary'))['total'] or 0
        expenses = Expense.objects.aggregate(total=Sum('amount'))['total'] or 0
        total_revenue = sales_revenue - employee_salary - expenses
        
        return {
            'monthlyRevenue': float(current_month_revenue),
            'totalBookings': current_month_bookings,
            'activeVehicles': active_vehicles,
            'servicesCompleted': services_completed,
            'revenueChange': round(revenue_change, 1),
            'bookingsChange': round(bookings_change, 1),
            'vehiclesChange': 0,  # This would need historical data to calculate
            'servicesChange': round(services_change, 1),
            'totalSales': float(total_sales),
            'productsUsedPrices': float(products_used),
            'salesRevenue': float(sales_revenue),
            'totalRevenue': float(total_revenue)
        }
