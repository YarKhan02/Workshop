# Booking Database Schema Documentation

This document describes the comprehensive booking system database design for the CarWorkshop application.

## Overview

The booking system consists of 6 main tables that handle the complete booking lifecycle from scheduling to completion, including reminders, additional services, and status tracking.

## Database Tables

### 1. **service** - Service Catalog
Stores all available services offered by the workshop.

```sql
CREATE TABLE service (
    id UUID PRIMARY KEY DEFAULT uuid4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,  -- e.g., 'basic_wash', 'full_detail'
    description TEXT,
    category VARCHAR(50) NOT NULL,     -- 'washing', 'detailing', 'maintenance', 'repair', 'inspection'
    base_price DECIMAL(10,2) NOT NULL,
    estimated_duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- Unique service codes for easy frontend integration
- Category-based organization
- Duration estimation for scheduling
- Soft delete with `is_active` flag

---

### 2. **booking** - Main Booking Table
The central table storing all booking information and relationships.

```sql
CREATE TABLE booking (
    id UUID PRIMARY KEY DEFAULT uuid4(),
    
    -- Foreign Keys
    customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES car(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES service(id) ON DELETE CASCADE,
    assigned_staff_id UUID REFERENCES user(id) ON DELETE SET NULL,
    created_by_id UUID REFERENCES user(id) ON DELETE SET NULL,
    
    -- Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    estimated_duration_minutes INTEGER NOT NULL,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending',  -- pending, confirmed, in_progress, completed, cancelled, no_show, rescheduled
    
    -- Pricing
    quoted_price DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2),
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    
    -- Notes
    customer_notes TEXT,
    staff_notes TEXT,
    special_instructions TEXT,
    
    -- Snapshot Data (for historical records)
    customer_phone VARCHAR(15) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    car_make VARCHAR(50) NOT NULL,
    car_model VARCHAR(50) NOT NULL,
    car_year VARCHAR(4) NOT NULL,
    car_license_plate VARCHAR(20) NOT NULL,
    car_color VARCHAR(30) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    -- Customer Feedback
    customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
    customer_feedback TEXT
);

-- Indexes for performance
CREATE INDEX idx_booking_scheduled_date_time ON booking(scheduled_date, scheduled_time);
CREATE INDEX idx_booking_status ON booking(status);
CREATE INDEX idx_booking_customer ON booking(customer_id);
CREATE INDEX idx_booking_car ON booking(car_id);
CREATE INDEX idx_booking_service ON booking(service_id);
```

**Key Features:**
- Complete audit trail with timestamps
- Snapshot data prevents data loss if customer/car info changes
- Flexible pricing with discounts
- Status tracking throughout lifecycle
- Customer feedback collection

---

### 3. **booking_status_history** - Status Change Tracking
Tracks all status changes for complete audit trail.

```sql
CREATE TABLE booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid4(),
    booking_id UUID NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
    old_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    changed_by_id UUID REFERENCES user(id) ON DELETE SET NULL,
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- Complete status change audit trail
- Tracks who made changes and when
- Optional reason for status changes

---

### 4. **booking_additional_service** - Upselling Services
Handles additional services added to bookings (for upselling).

```sql
CREATE TABLE booking_additional_service (
    id UUID PRIMARY KEY DEFAULT uuid4(),
    booking_id UUID NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES service(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,  -- calculated: quantity * unit_price
    added_by_id UUID REFERENCES user(id) ON DELETE SET NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    
    UNIQUE(booking_id, service_id)  -- Prevent duplicate services
);
```

**Key Features:**
- Support for multiple quantities
- Price tracking at time of addition
- Prevents duplicate service additions
- Tracks who added the service

---

### 5. **booking_time_slot** - Available Time Slots
Manages available time slots for booking scheduling.

```sql
CREATE TABLE booking_time_slot (
    id UUID PRIMARY KEY DEFAULT uuid4(),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_concurrent_bookings INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(date, start_time)
);
```

**Key Features:**
- Support for concurrent bookings
- Flexible time slot management
- Can be disabled without deletion

---

### 6. **booking_reminder** - Customer Reminders
Manages automated reminders sent to customers.

```sql
CREATE TABLE booking_reminder (
    id UUID PRIMARY KEY DEFAULT uuid4(),
    booking_id UUID NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
    reminder_type VARCHAR(20) NOT NULL,    -- confirmation, 24h_reminder, 2h_reminder, completion, feedback
    delivery_method VARCHAR(20) NOT NULL,  -- email, sms, push, whatsapp
    scheduled_at TIMESTAMP NOT NULL,
    sent_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT FALSE,
    message_content TEXT NOT NULL,
    error_message TEXT
);
```

**Key Features:**
- Multiple reminder types
- Multiple delivery methods
- Delivery tracking and error handling
- Flexible scheduling

## Relationships

```
customer (1) -----> (many) booking
car (1) ----------> (many) booking
service (1) -------> (many) booking
user (1) ----------> (many) booking [as assigned_staff]
user (1) ----------> (many) booking [as created_by]

booking (1) -------> (many) booking_status_history
booking (1) -------> (many) booking_additional_service
booking (1) -------> (many) booking_reminder

service (1) -------> (many) booking_additional_service
user (1) ----------> (many) booking_status_history [as changed_by]
user (1) ----------> (many) booking_additional_service [as added_by]
```

## Data Integration with Frontend

### Service Types (matching frontend)
```python
services = [
    {'code': 'basic_wash', 'name': 'Basic Wash', 'price': 2500, 'duration': 60},
    {'code': 'full_detail', 'name': 'Full Detail', 'price': 8500, 'duration': 180},
    {'code': 'interior_detail', 'name': 'Interior Detail', 'price': 4500, 'duration': 120},
    {'code': 'exterior_detail', 'name': 'Exterior Detail', 'price': 6500, 'duration': 150},
    {'code': 'premium_detail', 'name': 'Premium Detail', 'price': 15000, 'duration': 300},
]
```

### Status Flow
```
pending → confirmed → in_progress → completed
    ↓         ↓           ↓
cancelled   cancelled   cancelled
    ↓
no_show (if not cancelled before scheduled time)

rescheduled (special case - creates new booking)
```

## Setup Instructions

### 1. Run Migrations
```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 2. Seed Services Data
```bash
python manage.py shell < seed_services.py
```

### 3. Access Admin Interface
- Services: `/admin/workshop/service/`
- Bookings: `/admin/workshop/booking/`
- All booking-related models available in admin

## API Endpoints (Recommended)

```
GET    /api/bookings/                 # List bookings with filters
POST   /api/bookings/                 # Create new booking
GET    /api/bookings/{id}/            # Get booking details
PUT    /api/bookings/{id}/            # Update booking
DELETE /api/bookings/{id}/            # Delete booking
POST   /api/bookings/{id}/status/     # Update booking status
GET    /api/bookings/stats/           # Get booking statistics

GET    /api/services/                 # List available services
GET    /api/time-slots/               # Get available time slots
POST   /api/bookings/{id}/reminders/  # Send reminder
POST   /api/bookings/{id}/additional-services/  # Add additional service
```

## Performance Considerations

1. **Indexes**: Added on frequently queried columns
2. **Snapshot Data**: Prevents joins for historical data
3. **Status History**: Separate table for audit trail
4. **Time Slots**: Efficient scheduling management
5. **UUIDs**: Better for distributed systems and security

## Security Features

1. **UUID Primary Keys**: Prevents ID enumeration
2. **Soft Deletes**: Maintains data integrity
3. **Audit Trail**: Complete change tracking
4. **Data Snapshots**: Historical data preservation
5. **User Tracking**: Who did what and when

This design supports the complete booking lifecycle while maintaining data integrity, performance, and scalability.
