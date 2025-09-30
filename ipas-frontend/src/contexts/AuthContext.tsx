import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('ipas_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - replace with actual API call
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@insurer.com',
        role: 'reviewer',
        department: 'Medical Review',
        permissions: ['review_cases', 'make_decisions', 'view_analytics']
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        email: 'michael.chen@insurer.com',
        role: 'physician',
        department: 'Clinical Review',
        permissions: ['review_cases', 'make_decisions', 'override_ai', 'view_analytics']
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        role: 'provider',
        department: 'Emergency Medicine',
        permissions: ['submit_requests', 'view_own_cases']
      },
      {
        id: '4',
        name: 'Admin User',
        email: 'admin@insurer.com',
        role: 'admin',
        department: 'Administration',
        permissions: ['manage_users', 'view_analytics', 'system_config']
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('ipas_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ipas_user');
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
