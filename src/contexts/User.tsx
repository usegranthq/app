'use client';

import { createContext, useContext } from 'react';
import { User } from '@/types/app.types';

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children, user }: { children: React.ReactNode; user: User }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
