#!/bin/bash

# Booking Database Setup Script
# Run this from the backend directory

echo "🚀 Setting up Booking Database..."

# Check if we're in the right directory
if [ ! -f "manage.py" ]; then
    echo "❌ Error: Please run this script from the backend directory (where manage.py is located)"
    exit 1
fi

echo "📝 Making migrations..."
python manage.py makemigrations

echo "🗄️  Running migrations..."
python manage.py migrate

echo "🌱 Seeding services data..."
python manage.py seed_service

echo "⏰ Creating time slots..."
python manage.py seed_time_slots

echo "� Creating sample bookings (optional)..."
echo "Make sure you have customers and cars seeded first:"
echo "python manage.py seed_customer"
echo "python manage.py seed_car"
echo "python manage.py seed_booking"

echo "✅ Booking database setup complete!"
echo ""
echo "📋 Available seed commands:"
echo "- python manage.py seed_service      # Workshop services"
echo "- python manage.py seed_time_slots   # Available time slots"
echo "- python manage.py seed_booking      # Sample bookings (requires customers & cars)"
echo ""
echo "📚 Documentation:"
echo "- Database Schema: BOOKING_DATABASE_SCHEMA.md"
echo "- Models: workshop/models/booking.py"
