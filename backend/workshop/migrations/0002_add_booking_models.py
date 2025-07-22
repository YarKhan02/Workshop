# Generated migration for booking models

from django.db import migrations, models
import django.core.validators
import uuid
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('workshop', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('code', models.CharField(max_length=20, unique=True)),
                ('description', models.TextField(blank=True)),
                ('category', models.CharField(choices=[('washing', 'Car Washing'), ('detailing', 'Car Detailing'), ('maintenance', 'Maintenance'), ('repair', 'Repair'), ('inspection', 'Inspection')], max_length=50)),
                ('base_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('estimated_duration_minutes', models.PositiveIntegerField()),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'service',
                'ordering': ['category', 'name'],
            },
        ),
        migrations.CreateModel(
            name='BookingTimeSlot',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('max_concurrent_bookings', models.PositiveIntegerField(default=1)),
                ('is_available', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'booking_time_slot',
                'ordering': ['date', 'start_time'],
            },
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('scheduled_date', models.DateField()),
                ('scheduled_time', models.TimeField()),
                ('estimated_duration_minutes', models.PositiveIntegerField()),
                ('actual_start_time', models.DateTimeField(blank=True, null=True)),
                ('actual_end_time', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('cancelled', 'Cancelled'), ('no_show', 'No Show'), ('rescheduled', 'Rescheduled')], default='pending', max_length=20)),
                ('quoted_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('final_price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('discount_percentage', models.DecimalField(decimal_places=2, default=0.0, max_digits=5, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('discount_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('customer_notes', models.TextField(blank=True, help_text='Notes from customer')),
                ('staff_notes', models.TextField(blank=True, help_text='Internal notes from staff')),
                ('special_instructions', models.TextField(blank=True)),
                ('customer_phone', models.CharField(max_length=15)),
                ('customer_email', models.EmailField(max_length=254)),
                ('car_make', models.CharField(max_length=50)),
                ('car_model', models.CharField(max_length=50)),
                ('car_year', models.CharField(max_length=4)),
                ('car_license_plate', models.CharField(max_length=20)),
                ('car_color', models.CharField(max_length=30)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('confirmed_at', models.DateTimeField(blank=True, null=True)),
                ('cancelled_at', models.DateTimeField(blank=True, null=True)),
                ('cancellation_reason', models.TextField(blank=True)),
                ('customer_rating', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('customer_feedback', models.TextField(blank=True)),
                ('assigned_staff', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assigned_bookings', to='workshop.user')),
                ('car', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='workshop.car')),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_bookings', to='workshop.user')),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='workshop.customer')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='workshop.service')),
            ],
            options={
                'db_table': 'booking',
                'ordering': ['-scheduled_date', '-scheduled_time'],
            },
        ),
        migrations.CreateModel(
            name='BookingStatusHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('old_status', models.CharField(max_length=20)),
                ('new_status', models.CharField(max_length=20)),
                ('change_reason', models.TextField(blank=True)),
                ('changed_at', models.DateTimeField(auto_now_add=True)),
                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='status_history', to='workshop.booking')),
                ('changed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='workshop.user')),
            ],
            options={
                'db_table': 'booking_status_history',
                'ordering': ['-changed_at'],
            },
        ),
        migrations.CreateModel(
            name='BookingReminder',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('reminder_type', models.CharField(choices=[('confirmation', 'Booking Confirmation'), ('24h_reminder', '24 Hour Reminder'), ('2h_reminder', '2 Hour Reminder'), ('completion', 'Service Completion'), ('feedback', 'Feedback Request')], max_length=20)),
                ('delivery_method', models.CharField(choices=[('email', 'Email'), ('sms', 'SMS'), ('push', 'Push Notification'), ('whatsapp', 'WhatsApp')], max_length=20)),
                ('scheduled_at', models.DateTimeField()),
                ('sent_at', models.DateTimeField(blank=True, null=True)),
                ('is_sent', models.BooleanField(default=False)),
                ('message_content', models.TextField()),
                ('error_message', models.TextField(blank=True)),
                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reminders', to='workshop.booking')),
            ],
            options={
                'db_table': 'booking_reminder',
                'ordering': ['scheduled_at'],
            },
        ),
        migrations.CreateModel(
            name='BookingAdditionalService',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('notes', models.TextField(blank=True)),
                ('added_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='workshop.user')),
                ('booking', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='additional_services', to='workshop.booking')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='workshop.service')),
            ],
            options={
                'db_table': 'booking_additional_service',
            },
        ),
        migrations.AddIndex(
            model_name='booking',
            index=models.Index(fields=['scheduled_date', 'scheduled_time'], name='booking_sch_c3d0b0_idx'),
        ),
        migrations.AddIndex(
            model_name='booking',
            index=models.Index(fields=['status'], name='booking_status_ac0d5b_idx'),
        ),
        migrations.AddIndex(
            model_name='booking',
            index=models.Index(fields=['customer'], name='booking_custome_e1c4e1_idx'),
        ),
        migrations.AddIndex(
            model_name='booking',
            index=models.Index(fields=['car'], name='booking_car_id_c8dd23_idx'),
        ),
        migrations.AddIndex(
            model_name='booking',
            index=models.Index(fields=['service'], name='booking_service_f36a40_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='bookingtimeslot',
            unique_together={('date', 'start_time')},
        ),
        migrations.AlterUniqueTogether(
            name='bookingadditionalservice',
            unique_together={('booking', 'service')},
        ),
    ]
