import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, useAuthSession } from '../api/auth';
import type { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
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

// Add a global getter for the current access token
let globalAccessToken: string | null = null;

export function setGlobalAccessToken(token: string | null) {
  globalAccessToken = token;
}

export function getAccessTokenFromContext() {
  return globalAccessToken;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Only in memory
  const [isLoading, setIsLoading] = useState(true);
  const { setAccessToken, clearSession } = useAuthSession();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get access token from refresh cookie
        const refreshRes = await authApi.refreshToken(); // GETs /token/refresh/
        const newAccessToken = refreshRes.token;

        setToken(newAccessToken);
        setGlobalAccessToken(newAccessToken);
        setAccessToken(newAccessToken, 120); // for polling or auto-refresh

        // Fetch user info
        const data = await authApi.getProfile();
        setUser(data.user);
      } catch (error) {
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Update global token whenever it changes
  useEffect(() => {
    setGlobalAccessToken(token);
  }, [token]);

  // Login: store access token in memory, start auto-refresh
  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });
      setToken(data.token);
      setUser(data.user);
      setAccessToken(data.token, 120); // 2 min expiry default
    } catch (error) {
      throw error;
    }
  };

  // Logout: clear session, clear token from memory
  const logout = () => {
    setUser(null);
    setToken(null);
    clearSession();
  };

  const value: AuthContextType = {
    user,
    token,
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