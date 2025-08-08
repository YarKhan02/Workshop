// Global authentication error handler
// This module handles authentication failures and auto-logout

let authContextLogout: (() => void) | null = null;

// Register the logout function from AuthContext
export const registerAuthLogout = (logoutFn: () => void) => {
  authContextLogout = logoutFn;
};

// Handle authentication errors
export const handleAuthError = (error: any) => {
  // Check if this is an authentication error
  if (isAuthError(error)) {
    console.log('Authentication error detected, logging out...');
    
    // Clear localStorage immediately
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    // Trigger logout through AuthContext if available
    if (authContextLogout) {
      authContextLogout();
    }
    
    // Optionally redirect to login page
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.href = '/login';
    }
    
    return true; // Indicates error was handled
  }
  
  return false; // Not an auth error
};

// Check if an error is authentication-related
export const isAuthError = (error: any): boolean => {
  // Check for HTTP 401 Unauthorized
  if (error.message && error.message.includes('HTTP 401')) {
    return true;
  }
  
  // Check for specific JWT errors
  if (error.message && (
    error.message.includes('Invalid token') ||
    error.message.includes('Token is invalid') ||
    error.message.includes('Customer no longer exists') ||
    error.message.includes('Authentication credentials were not provided')
  )) {
    return true;
  }
  
  // Check for status codes
  if (error.status === 401) {
    return true;
  }
  
  return false;
};

// Utility to check if user should be logged out based on error
export const shouldLogoutOnError = (error: any): boolean => {
  return isAuthError(error);
};
