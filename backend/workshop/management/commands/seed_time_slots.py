from django.core.management.base import BaseCommand
from workshop.models.booking import BookingTimeSlot
from datetime import date, time, timedelta

class Command(BaseCommand):
    help = 'Seeds the database with available time slots for the next 30 days'

    def handle(self, *args, **kwargs):
        # Time slots for workshop operations (9 AM to 6 PM)
        time_slots = [
            (time(9, 0), time(10, 30)),   # 9:00 - 10:30
            (time(10, 30), time(12, 0)),  # 10:30 - 12:00
            (time(13, 0), time(14, 30)),  # 1:00 - 2:30 (after lunch)
            (time(14, 30), time(16, 0)),  # 2:30 - 4:00
            (time(16, 0), time(17, 30)),  # 4:00 - 5:30
        ]
        
        created_count = 0
        start_date = date.today()
        
        # Create time slots for next 30 days
        for day_offset in range(30):
            current_date = start_date + timedelta(days=day_offset)
            
            # Skip Fridays (workshop closed)
            if current_date.weekday() == 4:  # Friday is 4
                continue
            
            for start_time, end_time in time_slots:
                # Determine max concurrent bookings based on time slot
                # Morning and afternoon slots can handle more cars
                if start_time.hour < 12 or start_time.hour > 14:
                    max_concurrent = 2
                else:
                    max_concurrent = 1
                
                slot, created = BookingTimeSlot.objects.get_or_create(
                    date=current_date,
                    start_time=start_time,
                    defaults={
                        'end_time': end_time,
                        'max_concurrent_bookings': max_concurrent,
                        'is_available': True,
                    }
                )
                
                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(
                        f"Created time slot: {current_date} {start_time}-{end_time}"
                    ))
        
        self.stdout.write(self.style.SUCCESS(f"\nCreated {created_count} new time slots."))
        self.stdout.write(self.style.WARNING("Note: Fridays are skipped (workshop closed)."))
