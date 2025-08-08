/**
 * Format a Pakistani NIC number with dashes.
 * @param rawNIC - A string of digits (up to 13 characters)
 * @returns Formatted NIC (e.g., "42101-1234567-1")
 */
export function formatNIC(rawNIC: string): string {
  // Remove non-digit characters
  const digitsOnly = rawNIC.replace(/\D/g, '').slice(0, 13);

  // Apply formatting: 5 digits - 7 digits - 1 digit
  return digitsOnly.replace(
    /^(\d{5})(\d{1,7})?(\d{1})?$/,
    (_, p1, p2 = '', p3 = '') => {
      const parts = [p1, p2, p3].filter(Boolean);
      return parts.join('-');
    }
  );
}

/**
 * Remove dashes from NIC before saving.
 * @param formattedNIC - Formatted NIC like "42101-1234567-1"
 * @returns Plain NIC like "4210112345671"
 */
export const stripNicDashes = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 13); // Just digits, max 13
};

/**
 * Validate a Pakistani NIC number.
 * @param nic - NIC string (with or without dashes)
 * @returns true if valid, false otherwise
 */
export function validateNIC(nic: string): boolean {
  const digits = nic.replace(/\D/g, '');
  return digits.length === 13;
}

/**
 * Get error message for invalid NIC.
 * @param nic - NIC string (with or without dashes)
 * @returns Error message or empty string if valid
 */
export function getNICErrorMessage(nic: string): string {
  const digits = nic.replace(/\D/g, '');
  
  if (digits.length === 0) {
    return 'NIC is required';
  }
  
  if (digits.length < 13) {
    return 'NIC must be 13 digits';
  }
  
  if (digits.length > 13) {
    return 'NIC cannot be more than 13 digits';
  }
  
  return '';
}