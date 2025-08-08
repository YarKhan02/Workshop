import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api/auth';
import { RegisterFormData } from '../services/interfaces/auth';
import { stripNicDashes } from '../utils/nicValidation';
import { registerAuthLogout } from '../utils/authErrorHandler';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer'; // Only customers allowed in this interface
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isCustomer: boolean; // Helper to check if user is a customer
  login: (email: string, password: string) => Promise<boolean>;
  register: (formData: Omit<RegisterFormData, 'confirmPassword'>) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  verifyAuth: () => Promise<void>; // New method to verify authentication
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider rendering...'); // Debug log

  // Register logout function for global auth error handling
  useEffect(() => {
    registerAuthLogout(() => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    });
  }, []);

  // Verify authentication status by making a test API call
  const verifyAuth = async () => {
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('userRole');
    
    if (!savedUser || savedRole !== 'customer') {
      return; // No saved user, nothing to verify
    }

    try {
      // Make a simple API call to verify the token is still valid
      // Using a lightweight endpoint that requires authentication
      await authAPI.verifyToken();
      console.log('Auth verification successful');
    } catch (error) {
      console.log('Auth verification failed, clearing user data');
      // If verification fails, clear user data
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
  };

  useEffect(() => {
    console.log('AuthProvider useEffect running...'); // Debug log
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('userRole');
    
    if (savedUser && savedRole === 'customer') {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure the user has the customer role
        if (parsedUser.role === 'customer' || !parsedUser.role) {
          setUser({ ...parsedUser, role: 'customer' });
        } else {
          // Clear invalid user data
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
    }
    
    // After setting up user from localStorage, verify authentication
    if (savedUser && savedRole === 'customer') {
      verifyAuth(); // Verify in background, don't block loading
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data) {
        // Validate that the user is a customer
        if (response.data.role !== 'customer') {
          console.error('Access denied: Only customers are allowed on this platform');
          setLoading(false);
          throw new Error('Access denied: Only customers are allowed on this platform');
        }

        const userData: User = {
          id: response.data.user.id,
          name: `${response.data.user.first_name} ${response.data.user.last_name}`,
          email: response.data.user.email,
          role: 'customer'
        };
        
        setUser(userData);
        // Store user info in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', 'customer');
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (formData: Omit<RegisterFormData, 'confirmPassword'>): Promise<boolean> => {
    setLoading(true);
    try {
      // Format NIC for backend - remove dashes
      const backendData = {
        ...formData,
        nic: stripNicDashes(formData.nic)
      };
      
      const response = await authAPI.register(backendData);
      
      if (response.data) {
        // On successful registration, you might want to auto-login
        // For now, just return success
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isCustomer: !!user && user.role === 'customer',
    login,
    register,
    logout,
    loading,
    verifyAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
