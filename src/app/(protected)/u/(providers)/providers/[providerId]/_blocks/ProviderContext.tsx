'use client';

import { createContext, useContext } from 'react';

import { Provider } from '@/types/app.types';

interface ProviderContextType {
  provider: Provider;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const useProviderContext = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProviderContext must be used within a ProviderProvider');
  }
  return context;
};

interface ProviderProviderProps {
  provider: Provider;
  children: React.ReactNode;
}

export const ProviderProvider = ({ provider, children }: ProviderProviderProps) => {
  return <ProviderContext.Provider value={{ provider }}>{children}</ProviderContext.Provider>;
};
