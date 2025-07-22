# Switching Between Test Data and API

The Bookings.tsx component has been modified to use test data instead of API calls. Here's how to switch back to API calls when your backend is ready:

## Current Implementation (Test Data)
The component now uses:
- `mockBookings` from `../data/testBookings`
- Local filtering and pagination with `useMemo`
- Mock delete mutation that modifies the test data array

## To Switch Back to API Calls

### 1. Restore the imports
```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
```

### 2. Restore the Auth and QueryClient hooks
```typescript
const Bookings: React.FC = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  // ... rest of state
```

### 3. Replace the test data logic with API calls
```typescript
// Replace the useMemo filtering with useQuery
const { data: bookingsData, isLoading } = useQuery({
  queryKey: ['bookings', currentPage, searchTerm, statusFilter, dateFilter],
  queryFn: async (): Promise<{ bookings: Booking[]; pagination: any }> => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
      ...(searchTerm && { search: searchTerm }),
      ...(statusFilter && { status: statusFilter }),
      ...(dateFilter && { date: dateFilter }),
    });

    const response = await fetch(`http://localhost:5000/api/bookings?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return response.json();
  },
  enabled: !!token,
});

// Add stats query
const { data: statsData } = useQuery({
  queryKey: ['bookingStats'],
  queryFn: async (): Promise<any> => {
    const response = await fetch('http://localhost:5000/api/bookings/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch booking statistics');
    }

    return response.json();
  },
  enabled: !!token,
});

// Use API data
const bookings = bookingsData?.bookings || [];
const stats = statsData?.stats;
const pagination = bookingsData?.pagination;
```

### 4. Restore the original delete mutation
```typescript
const deleteBookingMutation = useMutation({
  mutationFn: async (bookingId: number) => {
    const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
    queryClient.invalidateQueries({ queryKey: ['bookingStats'] });
    toast.success('Booking deleted successfully');
    setIsDetailModalOpen(false);
  },
  onError: (error) => {
    toast.error('Failed to delete booking');
    console.error('Error deleting booking:', error);
  },
});
```

### 5. Remove test data imports and logic
- Remove `import { mockBookings, mockBookingStats } from '../data/testBookings';`
- Remove the `refreshKey` state and related logic
- Remove the `useMemo` filtering logic

## Benefits of Current Test Data Implementation
- ✅ No backend dependency
- ✅ Instant data loading
- ✅ All features work (search, filter, pagination, delete)
- ✅ Realistic Pakistani data for demo purposes
- ✅ Easy to switch back to API when ready
