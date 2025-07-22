// Test data for Bookings component
export interface MockBooking {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carId: number;
  carMake: string;
  carModel: string;
  carLicensePlate: string;
  serviceType: 'basic_wash' | 'full_detail' | 'interior_detail' | 'exterior_detail' | 'premium_detail';
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  totalAmount: number;
  createdAt: string;
}

export interface MockBookingStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  todayBookings: number;
}

export const mockBookings: MockBooking[] = [
  {
    id: 1,
    customerId: 101,
    customerName: "Ahmed Khan",
    customerPhone: "+92-300-1234567",
    customerEmail: "ahmed.khan@email.com",
    carId: 201,
    carMake: "Toyota",
    carModel: "Corolla",
    carLicensePlate: "ABC-123",
    serviceType: "full_detail",
    scheduledDate: "2025-07-23",
    scheduledTime: "10:00",
    estimatedDuration: 180,
    status: "confirmed",
    notes: "Customer requested extra attention to interior stains",
    totalAmount: 8500,
    createdAt: "2025-07-20T09:30:00Z"
  },
  {
    id: 2,
    customerId: 102,
    customerName: "Fatima Ali",
    customerPhone: "+92-301-9876543",
    customerEmail: "fatima.ali@email.com",
    carId: 202,
    carMake: "Honda",
    carModel: "Civic",
    carLicensePlate: "XYZ-456",
    serviceType: "basic_wash",
    scheduledDate: "2025-07-22",
    scheduledTime: "14:30",
    estimatedDuration: 60,
    status: "in_progress",
    notes: "Express service requested",
    totalAmount: 2500,
    createdAt: "2025-07-21T11:15:00Z"
  },
  {
    id: 3,
    customerId: 103,
    customerName: "Muhammad Hassan",
    customerPhone: "+92-302-5555555",
    customerEmail: "m.hassan@email.com",
    carId: 203,
    carMake: "Suzuki",
    carModel: "Alto",
    carLicensePlate: "DEF-789",
    serviceType: "interior_detail",
    scheduledDate: "2025-07-24",
    scheduledTime: "09:00",
    estimatedDuration: 120,
    status: "pending",
    notes: "Pet hair removal needed",
    totalAmount: 4500,
    createdAt: "2025-07-22T08:00:00Z"
  },
  {
    id: 4,
    customerId: 104,
    customerName: "Ayesha Malik",
    customerPhone: "+92-303-7777777",
    customerEmail: "ayesha.malik@email.com",
    carId: 204,
    carMake: "BMW",
    carModel: "X3",
    carLicensePlate: "GHI-012",
    serviceType: "premium_detail",
    scheduledDate: "2025-07-19",
    scheduledTime: "11:00",
    estimatedDuration: 240,
    status: "completed",
    notes: "Ceramic coating applied",
    totalAmount: 15000,
    createdAt: "2025-07-18T16:20:00Z"
  },
  {
    id: 5,
    customerId: 105,
    customerName: "Omar Sheikh",
    customerPhone: "+92-304-8888888",
    customerEmail: "omar.sheikh@email.com",
    carId: 205,
    carMake: "Mercedes",
    carModel: "C-Class",
    carLicensePlate: "JKL-345",
    serviceType: "exterior_detail",
    scheduledDate: "2025-07-25",
    scheduledTime: "15:00",
    estimatedDuration: 150,
    status: "confirmed",
    notes: "Paint correction requested",
    totalAmount: 9500,
    createdAt: "2025-07-22T10:45:00Z"
  },
  {
    id: 6,
    customerId: 106,
    customerName: "Zara Ahmed",
    customerPhone: "+92-305-9999999",
    customerEmail: "zara.ahmed@email.com",
    carId: 206,
    carMake: "Hyundai",
    carModel: "Elantra",
    carLicensePlate: "MNO-678",
    serviceType: "basic_wash",
    scheduledDate: "2025-07-20",
    scheduledTime: "16:30",
    estimatedDuration: 45,
    status: "cancelled",
    notes: "Customer cancelled due to rain",
    totalAmount: 2000,
    createdAt: "2025-07-19T13:10:00Z"
  },
  {
    id: 7,
    customerId: 107,
    customerName: "Tariq Hussain",
    customerPhone: "+92-306-1111111",
    customerEmail: "tariq.hussain@email.com",
    carId: 207,
    carMake: "Audi",
    carModel: "A4",
    carLicensePlate: "PQR-901",
    serviceType: "full_detail",
    scheduledDate: "2025-07-22",
    scheduledTime: "08:00",
    estimatedDuration: 200,
    status: "in_progress",
    notes: "Leather conditioning included",
    totalAmount: 12000,
    createdAt: "2025-07-21T14:30:00Z"
  },
  {
    id: 8,
    customerId: 108,
    customerName: "Sara Khan",
    customerPhone: "+92-307-2222222",
    customerEmail: "sara.khan@email.com",
    carId: 208,
    carMake: "Nissan",
    carModel: "Altima",
    carLicensePlate: "STU-234",
    serviceType: "interior_detail",
    scheduledDate: "2025-07-26",
    scheduledTime: "13:00",
    estimatedDuration: 90,
    status: "pending",
    notes: "Deep vacuum and sanitization",
    totalAmount: 3800,
    createdAt: "2025-07-22T09:15:00Z"
  },
  {
    id: 9,
    customerId: 109,
    customerName: "Bilal Raza",
    customerPhone: "+92-308-3333333",
    customerEmail: "bilal.raza@email.com",
    carId: 209,
    carMake: "Ford",
    carModel: "Focus",
    carLicensePlate: "VWX-567",
    serviceType: "exterior_detail",
    scheduledDate: "2025-07-23",
    scheduledTime: "12:00",
    estimatedDuration: 135,
    status: "confirmed",
    notes: "Headlight restoration needed",
    totalAmount: 6500,
    createdAt: "2025-07-21T17:45:00Z"
  },
  {
    id: 10,
    customerId: 110,
    customerName: "Nadia Butt",
    customerPhone: "+92-309-4444444",
    customerEmail: "nadia.butt@email.com",
    carId: 210,
    carMake: "Volkswagen",
    carModel: "Jetta",
    carLicensePlate: "YZA-890",
    serviceType: "premium_detail",
    scheduledDate: "2025-07-27",
    scheduledTime: "10:30",
    estimatedDuration: 300,
    status: "pending",
    notes: "Full paint protection package",
    totalAmount: 18000,
    createdAt: "2025-07-22T11:00:00Z"
  },
  {
    id: 11,
    customerId: 111,
    customerName: "Imran Siddique",
    customerPhone: "+92-310-5555555",
    customerEmail: "imran.siddique@email.com",
    carId: 211,
    carMake: "KIA",
    carModel: "Sportage",
    carLicensePlate: "BCD-123",
    serviceType: "basic_wash",
    scheduledDate: "2025-07-22",
    scheduledTime: "17:00",
    estimatedDuration: 50,
    status: "confirmed",
    notes: "Quick wash before event",
    totalAmount: 2200,
    createdAt: "2025-07-22T07:30:00Z"
  },
  {
    id: 12,
    customerId: 112,
    customerName: "Hina Qureshi",
    customerPhone: "+92-311-6666666",
    customerEmail: "hina.qureshi@email.com",
    carId: 212,
    carMake: "Mazda",
    carModel: "CX-5",
    carLicensePlate: "EFG-456",
    serviceType: "full_detail",
    scheduledDate: "2025-07-21",
    scheduledTime: "14:00",
    estimatedDuration: 195,
    status: "completed",
    notes: "Engine bay cleaning included",
    totalAmount: 11500,
    createdAt: "2025-07-20T12:20:00Z"
  }
];

export const mockBookingStats: MockBookingStats = {
  totalBookings: 12,
  completedBookings: 2,
  pendingBookings: 4,
  todayBookings: 3
};

export const mockPaginationData = {
  totalItems: 12,
  totalPages: 2,
  currentPage: 1,
  itemsPerPage: 10
};

// Function to get bookings for specific page
export const getBookingsPage = (page: number = 1, limit: number = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    bookings: mockBookings.slice(startIndex, endIndex),
    pagination: {
      totalItems: mockBookings.length,
      totalPages: Math.ceil(mockBookings.length / limit),
      currentPage: page,
      itemsPerPage: limit
    }
  };
};

// Function to filter bookings by status
export const getBookingsByStatus = (status: string) => {
  if (!status) return mockBookings;
  return mockBookings.filter(booking => booking.status === status);
};

// Function to filter bookings by date
export const getBookingsByDate = (date: string) => {
  if (!date) return mockBookings;
  return mockBookings.filter(booking => booking.scheduledDate === date);
};

// Function to search bookings
export const searchBookings = (searchTerm: string) => {
  if (!searchTerm) return mockBookings;
  
  const term = searchTerm.toLowerCase();
  return mockBookings.filter(booking => 
    booking.customerName.toLowerCase().includes(term) ||
    booking.customerEmail.toLowerCase().includes(term) ||
    booking.carMake.toLowerCase().includes(term) ||
    booking.carModel.toLowerCase().includes(term) ||
    booking.carLicensePlate.toLowerCase().includes(term) ||
    booking.serviceType.toLowerCase().includes(term)
  );
};
