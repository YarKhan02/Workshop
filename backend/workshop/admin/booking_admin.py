from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from workshop.models.booking import (
    Service, 
    Booking, 
    BookingStatusHistory, 
    BookingAdditionalService, 
    BookingTimeSlot, 
    BookingReminder
)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'category', 'base_price', 'estimated_duration_display', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['name', 'code', 'description']
    ordering = ['category', 'name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'category', 'description')
        }),
        ('Pricing & Duration', {
            'fields': ('base_price', 'estimated_duration_minutes')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def estimated_duration_display(self, obj):
        hours = obj.estimated_duration_minutes // 60
        minutes = obj.estimated_duration_minutes % 60
        if hours > 0:
            return f"{hours}h {minutes}m"
        return f"{minutes}m"
    estimated_duration_display.short_description = 'Duration'


class BookingStatusHistoryInline(admin.TabularInline):
    model = BookingStatusHistory
    extra = 0
    readonly_fields = ['old_status', 'new_status', 'changed_by', 'changed_at']
    can_delete = False


class BookingAdditionalServiceInline(admin.TabularInline):
    model = BookingAdditionalService
    extra = 0
    readonly_fields = ['total_price', 'added_by', 'added_at']


class BookingReminderInline(admin.TabularInline):
    model = BookingReminder
    extra = 0
    readonly_fields = ['sent_at', 'is_sent']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_id_short', 'customer_name', 'car_info', 'service', 
        'scheduled_datetime', 'status_badge', 'total_amount_display', 
        'assigned_staff', 'created_at'
    ]
    list_filter = [
        'status', 'service__category', 'time_slot__date', 
        'assigned_staff', 'created_at'
    ]
    search_fields = [
        'customer__first_name', 'customer__last_name', 
        'customer__email', 'customer_phone',
        'car__make', 'car__model', 'car_license_plate'
    ]
    date_hierarchy = 'time_slot__date'
    ordering = ['-time_slot__date', '-time_slot__start_time']
    
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'confirmed_at', 
        'cancelled_at', 'actual_duration_display'
    ]
    
    fieldsets = (
        ('Customer & Car Information', {
            'fields': (
                'customer', 'car',
                ('customer_phone', 'customer_email'),
                ('car_make', 'car_model', 'car_year'),
                ('car_license_plate', 'car_color')
            )
        }),
        ('Service Details', {
            'fields': (
                'service', 'assigned_staff', 'created_by',
                'estimated_duration_minutes'
            )
        }),
        ('Scheduling', {
            'fields': (
                'time_slot',
                ('actual_start_time', 'actual_end_time'),
                'actual_duration_display'
            )
        }),
        ('Status & Progress', {
            'fields': (
                'status', 'confirmed_at', 'cancelled_at',
                'cancellation_reason'
            )
        }),
        ('Pricing', {
            'fields': (
                ('quoted_price', 'final_price'),
                ('discount_percentage', 'discount_amount')
            )
        }),
        ('Notes & Instructions', {
            'fields': (
                'customer_notes', 'staff_notes', 'special_instructions'
            )
        }),
        ('Customer Feedback', {
            'fields': ('customer_rating', 'customer_feedback'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    inlines = [BookingAdditionalServiceInline, BookingStatusHistoryInline, BookingReminderInline]
    
    def booking_id_short(self, obj):
        return str(obj.id)[:8]
    booking_id_short.short_description = 'Booking ID'
    
    def customer_name(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"
    customer_name.short_description = 'Customer'
    
    def car_info(self, obj):
        return f"{obj.car_make} {obj.car_model} ({obj.car_license_plate})"
    car_info.short_description = 'Car'
    
    def scheduled_datetime(self, obj):
        return f"{obj.scheduled_date} {obj.scheduled_time}"
    scheduled_datetime.short_description = 'Scheduled'
    
    def status_badge(self, obj):
        colors = {
            'pending': '#fbbf24',      # yellow
            'confirmed': '#3b82f6',     # blue
            'in_progress': '#f97316',   # orange
            'completed': '#10b981',     # green
            'cancelled': '#ef4444',     # red
            'no_show': '#6b7280',       # gray
            'rescheduled': '#8b5cf6',   # purple
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def total_amount_display(self, obj):
        return f"PKR {obj.get_total_amount():,.0f}"
    total_amount_display.short_description = 'Total'
    
    def actual_duration_display(self, obj):
        duration = obj.get_actual_duration_minutes()
        if duration is not None:
            hours = duration // 60
            minutes = duration % 60
            if hours > 0:
                return f"{hours}h {minutes}m"
            return f"{minutes}m"
        return "-"
    actual_duration_display.short_description = 'Actual Duration'


@admin.register(BookingStatusHistory)
class BookingStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['booking_short', 'status_change', 'changed_by', 'changed_at']
    list_filter = ['old_status', 'new_status', 'changed_at']
    search_fields = ['booking__customer__first_name', 'booking__customer__last_name']
    readonly_fields = ['booking', 'old_status', 'new_status', 'changed_by', 'changed_at']
    ordering = ['-changed_at']
    
    def booking_short(self, obj):
        return f"Booking {str(obj.booking.id)[:8]}"
    booking_short.short_description = 'Booking'
    
    def status_change(self, obj):
        return f"{obj.old_status} → {obj.new_status}"
    status_change.short_description = 'Status Change'


@admin.register(BookingAdditionalService)
class BookingAdditionalServiceAdmin(admin.ModelAdmin):
    list_display = ['booking_short', 'service', 'quantity', 'unit_price', 'total_price', 'added_by', 'added_at']
    list_filter = ['service', 'added_at']
    search_fields = ['booking__customer__first_name', 'booking__customer__last_name', 'service__name']
    readonly_fields = ['total_price', 'added_by', 'added_at']
    
    def booking_short(self, obj):
        return f"Booking {str(obj.booking.id)[:8]}"
    booking_short.short_description = 'Booking'


@admin.register(BookingTimeSlot)
class BookingTimeSlotAdmin(admin.ModelAdmin):
    list_display = ['date', 'time_range', 'max_concurrent_bookings', 'available_slots_display', 'is_available']
    list_filter = ['is_available', 'date']
    date_hierarchy = 'date'
    ordering = ['date', 'start_time']
    
    def time_range(self, obj):
        return f"{obj.start_time} - {obj.end_time}"
    time_range.short_description = 'Time Range'
    
    def available_slots_display(self, obj):
        return f"{obj.get_available_slots()}/{obj.max_concurrent_bookings}"
    available_slots_display.short_description = 'Available/Total'


@admin.register(BookingReminder)
class BookingReminderAdmin(admin.ModelAdmin):
    list_display = ['booking_short', 'reminder_type', 'delivery_method', 'scheduled_at', 'sent_status', 'sent_at']
    list_filter = ['reminder_type', 'delivery_method', 'is_sent', 'scheduled_at']
    search_fields = ['booking__customer__first_name', 'booking__customer__last_name']
    readonly_fields = ['sent_at', 'is_sent']
    ordering = ['-scheduled_at']
    
    def booking_short(self, obj):
        return f"Booking {str(obj.booking.id)[:8]}"
    booking_short.short_description = 'Booking'
    
    def sent_status(self, obj):
        if obj.is_sent:
            return format_html('<span style="color: green;">✓ Sent</span>')
        else:
            return format_html('<span style="color: red;">✗ Pending</span>')
    sent_status.short_description = 'Status'
