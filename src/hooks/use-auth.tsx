
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await getUserData(firebaseUser.uid, firebaseUser.email);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login';
    const isCustomerInfoPage = pathname === '/customer-info';

    // If no user is logged in
    if (!user) {
      if (!isAuthPage) {
        router.replace('/login');
      }
      return;
    }

    // If a user is logged in
    if (isAuthPage) {
      if (user.role === 'owner') {
        router.replace('/dashboard');
      } else {
        // For customers, check if info is complete
        if (!user.infoComplete) {
            router.replace('/customer-info');
        } else {
            router.replace('/');
        }
      }
      return;
    }

    if (user.role === 'owner') {
      // Owner should be on dashboard pages
      if (!pathname.startsWith('/dashboard')) {
        router.replace('/dashboard');
      }
    } else if (user.role === 'customer') {
      // Customer needs to complete their info first
      if (!user.infoComplete && !isCustomerInfoPage) {
        router.replace('/customer-info');
      }
      // If info is complete but they are on the info page, redirect to home
      else if (user.infoComplete && isCustomerInfoPage) {
        router.replace('/');
      }
      // Customers should not be able to access the dashboard
      else if (pathname.startsWith('/dashboard')) {
        router.replace('/');
      }
    }

  }, [user, loading, pathname, router]);

  const login = async (email:string, password:string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Let the useEffect handle the redirect
      return true;
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
          setError('The Firebase API Key is not valid. Please check your configuration.');
      } else {
          setError('An unknown error occurred during login. Please try again.');
      }
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push('/login');
  };

  const refreshUser = async () => {
      if (auth.currentUser) {
          setLoading(true);
          const appUser = await getUserData(auth.currentUser.uid, auth.currentUser.email);
          setUser(appUser);
          setLoading(false);
      }
  }

  // This prevents flashing the wrong UI while waiting for auth state
  const isAuthReady = !loading;
  const isCorrectPage = () => {
    if(loading) return false; // Not ready yet
    if(!user) return pathname === '/login';
    if(user.role === 'owner') return pathname.startsWith('/dashboard');
    if(user.role === 'customer' && !user.infoComplete) return pathname === '/customer-info';
    // If we get here, it's a customer with complete info
    return !pathname.startsWith('/dashboard') && pathname !== '/customer-info';
  }


  if (!isAuthReady || !isCorrectPage()) {
     return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, logout, refreshUser }}>
        {children}
    </AuthContext.Provider>
  );
};
