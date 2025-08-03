// Currency configuration and utilities
import { DEFAULT_BUSINESS_SETTINGS } from '../constants/settings';

// Currency configuration interface
export interface CurrencyConfig {
  code: 'PKR' | 'USD' | 'EUR' | 'GBP';
  symbol: string;
  locale: string;
  name: string;
}

// Supported currencies configuration
export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  PKR: {
    code: 'PKR',
    symbol: '₨',
    locale: 'en-PK',
    name: 'Pakistani Rupee',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    locale: 'en-US',
    name: 'US Dollar',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    locale: 'de-DE',
    name: 'Euro',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    locale: 'en-GB',
    name: 'British Pound',
  },
};

// Get current currency from settings (this could come from context, localStorage, or API)
export const getCurrentCurrency = (): CurrencyConfig => {
  // For now, we'll use the default from settings
  // In a real app, this could come from user settings, localStorage, or context
  const currentCurrencyCode = DEFAULT_BUSINESS_SETTINGS.currency;
  return CURRENCY_CONFIGS[currentCurrencyCode] || CURRENCY_CONFIGS.PKR;
};

// Main currency formatting function
export const formatCurrency = (
  amount: number | string,
  options?: {
    currency?: 'PKR' | 'USD' | 'EUR' | 'GBP';
    showDecimals?: boolean;
    locale?: string;
  }
): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '₨0';
  }

  const currencyConfig = options?.currency 
    ? CURRENCY_CONFIGS[options.currency] 
    : getCurrentCurrency();

  const locale = options?.locale || currencyConfig.locale;
  const showDecimals = options?.showDecimals !== false; // Default to true

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyConfig.code,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(numericAmount);
  } catch (error) {
    // Fallback to manual formatting if Intl.NumberFormat fails
    const formattedNumber = showDecimals 
      ? numericAmount.toFixed(2) 
      : Math.round(numericAmount).toString();
    
    return `${currencyConfig.symbol}${formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
};

// Specific formatting functions for different use cases
export const formatCurrencyCompact = (amount: number | string): string => {
  return formatCurrency(amount, { showDecimals: false });
};

export const formatCurrencyWithDecimals = (amount: number | string): string => {
  return formatCurrency(amount, { showDecimals: true });
};

// Legacy function name for backward compatibility
export const formatPKRCurrency = (amount: number | string): string => {
  return formatCurrency(amount, { currency: 'PKR' });
};

// Get currency symbol for the current currency
export const getCurrencySymbol = (): string => {
  return getCurrentCurrency().symbol;
};

// Get currency code for the current currency
export const getCurrencyCode = (): string => {
  return getCurrentCurrency().code;
};

// Convert amount to display format without currency symbol
export const formatNumber = (amount: number | string, showDecimals: boolean = true): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '0';
  }

  const currentCurrency = getCurrentCurrency();
  
  try {
    return new Intl.NumberFormat(currentCurrency.locale, {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(numericAmount);
  } catch (error) {
    // Fallback formatting
    const formattedNumber = showDecimals 
      ? numericAmount.toFixed(2) 
      : Math.round(numericAmount).toString();
    
    return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

// Parse currency string back to number
export const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;
  
  // Remove currency symbols and non-numeric characters except dots and commas
  const cleanString = currencyString.replace(/[^\d.,]/g, '');
  
  // Handle different decimal separators
  const normalizedString = cleanString.replace(/,/g, '.');
  
  return parseFloat(normalizedString) || 0;
};

export default {
  formatCurrency,
  formatCurrencyCompact,
  formatCurrencyWithDecimals,
  formatPKRCurrency,
  formatNumber,
  parseCurrency,
  getCurrentCurrency,
  getCurrencySymbol,
  getCurrencyCode,
  CURRENCY_CONFIGS,
};
