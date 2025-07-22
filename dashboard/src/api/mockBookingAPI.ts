import { 
  mockBookings, 
  mockBookingStats, 
  searchBookings
} from '../data/testBookings';
import type { MockBooking } from '../data/testBookings';

// Mock API service for testing Bookings component
export class MockBookingAPI {
  private static delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Mock fetch bookings with filtering and pagination
  static async fetchBookings(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    date?: string;
  }) {
    await this.delay(500); // Simulate network delay

    let filteredBookings = [...mockBookings];

    // Apply filters
    if (params.search) {
      filteredBookings = searchBookings(params.search);
    }

    if (params.status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === params.status);
    }

    if (params.date) {
      filteredBookings = filteredBookings.filter(booking => booking.scheduledDate === params.date);
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      bookings: filteredBookings.slice(startIndex, endIndex),
      pagination: {
        totalItems: filteredBookings.length,
        totalPages: Math.ceil(filteredBookings.length / limit),
        currentPage: page,
        itemsPerPage: limit
      }
    };
  }

  // Mock fetch booking statistics
  static async fetchBookingStats() {
    await this.delay(300);
    return { stats: mockBookingStats };
  }

  // Mock create booking
  static async createBooking(bookingData: Partial<MockBooking>) {
    await this.delay(800);
    
    const newBooking: MockBooking = {
      id: Math.max(...mockBookings.map(b => b.id)) + 1,
      customerId: bookingData.customerId || 999,
      customerName: bookingData.customerName || '',
      customerPhone: bookingData.customerPhone || '',
      customerEmail: bookingData.customerEmail || '',
      carId: bookingData.carId || 999,
      carMake: bookingData.carMake || '',
      carModel: bookingData.carModel || '',
      carLicensePlate: bookingData.carLicensePlate || '',
      serviceType: bookingData.serviceType || 'basic_wash',
      scheduledDate: bookingData.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: bookingData.scheduledTime || '10:00',
      estimatedDuration: bookingData.estimatedDuration || 60,
      status: bookingData.status || 'pending',
      notes: bookingData.notes || '',
      totalAmount: bookingData.totalAmount || 0,
      createdAt: new Date().toISOString()
    };

    mockBookings.push(newBooking);
    return newBooking;
  }

  // Mock update booking
  static async updateBooking(bookingId: number, bookingData: Partial<MockBooking>) {
    await this.delay(600);
    
    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    mockBookings[bookingIndex] = { ...mockBookings[bookingIndex], ...bookingData };
    return mockBookings[bookingIndex];
  }

  // Mock delete booking
  static async deleteBooking(bookingId: number) {
    await this.delay(400);
    
    const bookingIndex = mockBookings.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    mockBookings.splice(bookingIndex, 1);
    return { success: true };
  }

  // Mock get booking by ID
  static async getBookingById(bookingId: number) {
    await this.delay(300);
    
    const booking = mockBookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    return booking;
  }
}

// Helper to mock fetch requests for testing
export const mockFetch = (url: string, options?: RequestInit) => {
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // Mock booking endpoints
  if (path === '/api/bookings') {
    if (options?.method === 'POST') {
      const body = JSON.parse(options.body as string);
      return Promise.resolve({
        ok: true,
        json: () => MockBookingAPI.createBooking(body)
      });
    } else {
      const params = {
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '10'),
        search: searchParams.get('search') || undefined,
        status: searchParams.get('status') || undefined,
        date: searchParams.get('date') || undefined
      };
      return Promise.resolve({
        ok: true,
        json: () => MockBookingAPI.fetchBookings(params)
      });
    }
  }

  if (path === '/api/bookings/stats') {
    return Promise.resolve({
      ok: true,
      json: () => MockBookingAPI.fetchBookingStats()
    });
  }

  if (path.startsWith('/api/bookings/') && options?.method === 'DELETE') {
    const bookingId = parseInt(path.split('/').pop() || '0');
    return Promise.resolve({
      ok: true,
      json: () => MockBookingAPI.deleteBooking(bookingId)
    });
  }

  if (path.startsWith('/api/bookings/') && options?.method === 'PUT') {
    const bookingId = parseInt(path.split('/').pop() || '0');
    const body = JSON.parse(options.body as string);
    return Promise.resolve({
      ok: true,
      json: () => MockBookingAPI.updateBooking(bookingId, body)
    });
  }

  // Default response for unhandled routes
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' })
  });
};
