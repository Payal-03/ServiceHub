import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, userService } from '../services/api';
import { MockStorage } from '../services/mockStorage';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'CUSTOMER' | 'PROVIDER';
  }) => Promise<User>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<User>;
  quickSwitchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('sh_auth_token_v1');
        const storedUser = localStorage.getItem('sh_active_user_v1');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Default to Payal Sharma (Customer) so the user experiences the full rich UI right away
          const users = MockStorage.getUsers();
          const defaultUser = users.find(u => u.role === 'CUSTOMER') || users[0];
          if (defaultUser) {
            const mockToken = `jwt-token-${defaultUser.id}-default`;
            localStorage.setItem('sh_auth_token_v1', mockToken);
            localStorage.setItem('sh_active_user_v1', JSON.stringify(defaultUser));
            setToken(mockToken);
            setUser(defaultUser);
          }
        }
      } catch (e) {
        console.error('Failed to initialize auth state', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('sh_auth_token_v1', res.token);
      localStorage.setItem('sh_active_user_v1', JSON.stringify(res.user));
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'CUSTOMER' | 'PROVIDER';
  }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('sh_auth_token_v1', res.token);
      localStorage.setItem('sh_active_user_v1', JSON.stringify(res.user));
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sh_auth_token_v1');
    localStorage.removeItem('sh_active_user_v1');
  };

  const updateProfile = async (data: Partial<User>): Promise<User> => {
    if (!user) throw new Error('No user logged in');
    const updated = await userService.updateProfile(user.id, data);
    setUser(updated);
    return updated;
  };

  const quickSwitchRole = (targetRole: UserRole) => {
    const users = MockStorage.getUsers();
    let target = users.find(u => u.role === targetRole && u.status === 'ACTIVE');
    if (!target) {
      target = users[0];
    }
    const mockToken = `jwt-token-${target.id}-switch`;
    localStorage.setItem('sh_auth_token_v1', mockToken);
    localStorage.setItem('sh_active_user_v1', JSON.stringify(target));
    setToken(mockToken);
    setUser(target);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        quickSwitchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
