/**
 * Format currency for display in analytics
 */
export const formatCurrency = (amount: number | undefined | null): string => {
  // Handle undefined, null, or invalid numbers
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs 0';
  }
  
  const numAmount = Number(amount);
  
  if (numAmount >= 1000000) {
    return `Rs ${(numAmount / 1000000).toFixed(1)}M`;
  } else if (numAmount >= 1000) {
    return `Rs ${(numAmount / 1000).toFixed(0)}K`;
  } else {
    return `Rs ${numAmount.toLocaleString()}`;
  }
};

/**
 * Format number for display
 */
export const formatNumber = (num: number | undefined | null): string => {
  // Handle undefined, null, or invalid numbers
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  
  const numValue = Number(num);
  
  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`;
  } else if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(0)}K`;
  } else {
    return numValue.toLocaleString();
  }
};

/**
 * Calculate percentage change
 */
export const calculateChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
  if (previous === 0) {
    return { value: 0, isPositive: true };
  }
  
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change),
    isPositive: change >= 0
  };
};
