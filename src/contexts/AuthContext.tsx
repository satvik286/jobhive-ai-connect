
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        // Parse the token properly - it's base64 encoded JSON for our mock system
        const decoded = JSON.parse(atob(token));
        
        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setUser({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role,
          });
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (error) {
        console.error('Token decode error:', error);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      // Mock API call - replace with real API
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('employer') ? 'employer' as const : 'jobseeker' as const,
      };

      // Create a proper base64 encoded token
      const tokenPayload = {
        ...mockUser,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      };
      
      const mockToken = btoa(JSON.stringify(tokenPayload));

      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, role: 'jobseeker' | 'employer') => {
    try {
      // Mock API call - replace with real API
      const mockUser = {
        id: Date.now().toString(),
        email,
        name,
        role,
      };

      // Create a proper base64 encoded token
      const tokenPayload = {
        ...mockUser,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      };
      
      const mockToken = btoa(JSON.stringify(tokenPayload));

      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      
      toast({
        title: "Registration successful",
        description: `Welcome to JobPortal, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
