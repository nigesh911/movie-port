'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import AuthModal from '@/components/AuthModal';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signIn = (email: string, password: string) => {
    // Implement actual sign in logic here
    console.log('Signing in with:', email, password);
    setUser({ id: '1', name: email.split('@')[0], email });
    closeAuthModal();
  };

  const signUp = (email: string, password: string) => {
    // Implement actual sign up logic here
    console.log('Signing up with:', email, password);
    setUser({ id: '1', name: email.split('@')[0], email });
    closeAuthModal();
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, openAuthModal, closeAuthModal, signIn, signUp, signOut }}>
      {children}
      {isAuthModalOpen && <AuthModal />}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}