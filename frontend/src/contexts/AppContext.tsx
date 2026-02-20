import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/types';
import { useNavigate } from 'react-router-dom';

type AppContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoggingOut: boolean;
  apiURL: string;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const navigate = useNavigate();
  const [user, setUserState] = useState<User | null>(() => {
    // Inicializa com o valor do localStorage (se existir)
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const apiURL = import.meta.env.VITE_API_URL;

  // Salva no localStorage sempre que o user mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
  };

  const logout = () => {
    // Marca que está deslogando para evitar toasts de "não autenticado"
    setIsLoggingOut(true);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUserState(null);
    navigate('/');
    // Reset do flag após navegação
    setTimeout(() => setIsLoggingOut(false), 100);
  };

  const value: AppContextValue = {
    user,
    setUser,
    logout,
    isLoggingOut,
    apiURL,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp precisa estar dentro de <AppProvider>');
  }
  return ctx;
}
