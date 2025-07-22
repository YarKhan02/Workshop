# Test Data for Bookings Component

This directory contains test data and mock API services for the Bookings component in the CarWorkshop dashboard.

## Files

### `testBookings.ts`
Contains mock booking data and utility functions:

- **`mockBookings`**: Array of 12 sample booking records with realistic Pakistani names, phone numbers, and car details
- **`mockBookingStats`**: Statistics object matching the expected API response format
- **`mockPaginationData`**: Sample pagination metadata
- **Utility functions**: For filtering and searching bookings

### `mockBookingAPI.ts`
Mock API service that simulates backend responses:

- **`MockBookingAPI`**: Class with static methods to simulate API calls
- **`mockFetch`**: Function to replace fetch calls during testing

## Sample Data Overview

The test data includes:

### Booking Records
- 12 bookings with various statuses (pending, confirmed, in_progress, completed, cancelled)
- Different service types (basic_wash, full_detail, interior_detail, exterior_detail, premium_detail)
- Realistic Pakistani customer names and contact information
- Various car makes and models (Toyota, Honda, BMW, Mercedes, etc.)
- Different scheduling dates and times
- Price ranges from PKR 2,000 to PKR 18,000

### Statistics
- Total bookings: 12
- Completed bookings: 2
- Pending bookings: 4
- Today's bookings: 3

## Usage in Testing

### Option 1: Direct Import in Component
```typescript
import { mockBookings, mockBookingStats } from '../data/testBookings';

// Use directly in component state or mock API responses
```

### Option 2: Mock API Service
```typescript
import { MockBookingAPI } from '../api/mockBookingAPI';

// Use in place of actual API calls
const bookingsData = await MockBookingAPI.fetchBookings({
  page: 1,
  limit: 10,
  search: 'Ahmed',
  status: 'confirmed'
});
```

### Option 3: Replace Fetch (for React Query)
```typescript
import { mockFetch } from '../api/mockBookingAPI';

// Override global fetch for testing
global.fetch = mockFetch as any;
```

## Features Covered

The test data supports all Bookings component features:

- ✅ Pagination (12 items across 2 pages)
- ✅ Search by customer name, email, car details, service type
- ✅ Filter by status (pending, confirmed, in_progress, completed, cancelled)
- ✅ Filter by date
- ✅ Statistics display
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Various service types with appropriate pricing
- ✅ Realistic Pakistani context (names, phone formats, currency)

## Customization

To modify the test data:

1. **Add more bookings**: Extend the `mockBookings` array
2. **Change statistics**: Update `mockBookingStats` object
3. **Modify API behavior**: Adjust `MockBookingAPI` methods
4. **Add new service types**: Update the `serviceType` type and add corresponding data

## Integration with Existing Code

The test data is designed to work seamlessly with the existing Bookings.tsx component without any code changes. The mock API maintains the same interface as the real backend API.
