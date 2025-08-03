// ==================== BOOKING TYPES ====================

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carId: string;
  carMake: string;
  carModel: string;
  carLicensePlate: string;
  serviceType: string;
  serviceName?: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  customer_notes?: string;
  totalAmount: number;
  createdAt: string;
}

// ==================== COMPONENT PROPS INTERFACES ====================

export interface BookingTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onViewBooking: (booking: Booking) => void;
  onEditBooking: (booking: Booking) => void;
}

export interface BookingFiltersProps {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClearFilters: () => void;
}

export interface BookingStatsData {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  todayBookings: number;
}

export interface BookingStatsProps {
  stats: BookingStatsData;
  isLoading?: boolean;
}

// ==================== MODAL PROPS INTERFACES ====================

export interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}
