// Utility functions for booking-related operations

// Format currency for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Check if it's today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    // Otherwise, format as a readable date
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

// Format time for display
export const formatTime = (timeString: string): string => {
  try {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeString;
  }
};

// Format duration in minutes to human readable
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Validate car form data
export const validateCarData = (car: {
  make: string;
  model: string;
  year: string;
  license_plate: string;
  color?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!car.make.trim()) {
    errors.push('Make is required');
  }

  if (!car.model.trim()) {
    errors.push('Model is required');
  }

  if (!car.year.trim()) {
    errors.push('Year is required');
  } else {
    const year = parseInt(car.year);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
      errors.push('Please enter a valid year');
    }
  }

  if (!car.license_plate.trim()) {
    errors.push('License plate is required');
  } else {
    // Basic license plate validation (adjust based on your requirements)
    const licenseRegex = /^[A-Z0-9-]{5,12}$/i;
    if (!licenseRegex.test(car.license_plate.replace(/\s+/g, ''))) {
      errors.push('Please enter a valid license plate');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generate available years for car selection
export const getAvailableYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  
  for (let year = currentYear + 1; year >= 1990; year--) {
    years.push(year.toString());
  }
  
  return years;
};

// Check if a time slot is in the past
export const isTimeSlotInPast = (date: string, startTime: string): boolean => {
  try {
    const slotDateTime = new Date(`${date}T${startTime}`);
    return slotDateTime < new Date();
  } catch {
    return false;
  }
};

// Calculate booking end time
export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  try {
    const start = new Date(`1970-01-01T${startTime}`);
    start.setMinutes(start.getMinutes() + durationMinutes);
    
    return start.toTimeString().slice(0, 5); // Returns HH:MM format
  } catch {
    return startTime;
  }
};

// Handle API errors consistently
export const handleApiError = (error: any): string => {
  console.error('API Error:', error);
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Get booking status color
export const getBookingStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'text-yellow-400';
    case 'confirmed':
      return 'text-blue-400';
    case 'in_progress':
      return 'text-orange-400';
    case 'completed':
      return 'text-green-400';
    case 'cancelled':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

// Get booking status background color
export const getBookingStatusBgColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-400/10 border-yellow-400/20';
    case 'confirmed':
      return 'bg-blue-400/10 border-blue-400/20';
    case 'in_progress':
      return 'bg-orange-400/10 border-orange-400/20';
    case 'completed':
      return 'bg-green-400/10 border-green-400/20';
    case 'cancelled':
      return 'bg-red-400/10 border-red-400/20';
    default:
      return 'bg-gray-400/10 border-gray-400/20';
  }
};
