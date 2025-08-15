
from workshop.queries.customer_interface_queries.my_bookings_queries import MyBookingsQueries
from workshop.serializers import BookingListSerializer


class MyBookingsService:

    def get_my_bookings(self, customer):
        """
        Get customer bookings using optimized query that only fetches needed fields
        """
        bookings = MyBookingsQueries.get_customer_bookings_optimized({'customer': customer.id})
        serializer = BookingListSerializer(bookings['queryset'], many=True)
        print(serializer.data)  # Debugging output
        return serializer.data
    
    def get_my_bookings_by_status(self, customer, status):
        """
        Get customer bookings filtered by status using optimized query
        """
        bookings = MyBookingsQueries.get_customer_bookings_by_status_optimized(customer, status)
        serializer = BookingListSerializer(bookings, many=True)
        return serializer.data
    
    def get_my_recent_bookings(self, customer, limit=5):
        """
        Get customer's most recent bookings using optimized query
        """
        bookings = MyBookingsQueries.get_customer_recent_bookings_optimized(customer, limit)
        serializer = BookingListSerializer(bookings, many=True)
        return serializer.data