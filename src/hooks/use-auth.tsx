
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getUserData } from '@/services/authService';
import type { AppUser } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  login: (email:string, password:string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleAuthStateChanged = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const appUser = await getUserData(firebaseUser.uid);
      if (appUser) {
        setUser(appUser);
        if (pathname === '/login') {
           if (appUser.role === 'owner') {
             router.replace('/dashboard');
           } else if (!appUser.infoComplete) {
             router.replace('/customer-info');
           } else {
             router.replace('/');
           }
        } else if (appUser.role === 'customer' && !appUser.infoComplete && pathname !== '/customer-info') {
            router.replace('/customer-info');
        }
      } else {
        // This case can happen if user exists in Auth but not in Firestore 'users' collection
        // Or if there is a delay in user document creation.
        // For this app, we assume a user doc always exists upon signup.
        setUser(null);
        if (pathname !== '/login') router.replace('/login');
      }
    } else {
      setUser(null);
      if (pathname !== '/login') router.replace('/login');
    }
    setLoading(false);
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChanged);
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email:string, password:string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle user state and redirection
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred.');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    router.push('/login');
    setLoading(false);
  };

  const refreshUser = async () => {
      if (auth.currentUser) {
          const appUser = await getUserData(auth.currentUser.uid);
          setUser(appUser);
      }
  }

  const value = { user, loading, error, setError, login, logout, refreshUser };

  return (
    <AuthContext.Provider value={value}>
        {/* Render a global loading screen while checking auth state on initial load */}
        {loading && !user && pathname !== '/login' ? (
            <div className="w-full h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
            children
        )}
    </AuthContext.Provider>
  );
};
