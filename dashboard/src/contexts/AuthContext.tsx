import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { authApi } from '../api/auth';
import type { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Set up automatic token refresh
  const scheduleTokenRefresh = () => {
    // Clear any existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Schedule refresh for 7.5 hours (30 minutes before 8-hour expiry)
    const refreshInterval = 7.5 * 60 * 60 * 1000; // 7.5 hours in milliseconds
    
    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        await authApi.refreshToken();
        // Schedule next refresh
        scheduleTokenRefresh();
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, user needs to login again
        setUser(null);
      }
    }, refreshInterval);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated using cookies
        const authStatus = await authApi.getAuthStatus();
        if (authStatus.authenticated && authStatus.user) {
          setUser(authStatus.user);
          // Start automatic token refresh
          scheduleTokenRefresh();
        } else {
          setUser(null);
        }
      } catch (error) {
        // User is not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup timeout on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Login: cookies are automatically set by the server
  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });
      setUser(data.user);
      // Start automatic token refresh after login
      scheduleTokenRefresh();
    } catch (error) {
      throw error;
    }
  };

  // Logout: server will clear cookies
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout fails, clear local state
    } finally {
      setUser(null);
      // Clear refresh timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};