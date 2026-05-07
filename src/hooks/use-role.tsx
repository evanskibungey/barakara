'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/contexts/auth-context';

type Role = 'admin' | 'chairperson' | 'member';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const primaryRole = user?.roles?.[0]?.name?.toLowerCase() ?? 'member';
  const role: Role =
    primaryRole === 'admin'
      ? 'admin'
      : primaryRole === 'chairperson'
        ? 'chairperson'
        : 'member';

  const setRole = (_role: Role) => {};

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
