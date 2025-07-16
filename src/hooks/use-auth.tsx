
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
    // onAuthStateChanged is a client-side only listener.
    // It should not run on the server.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await getUserData(firebaseUser.uid);
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

    if (!user) {
      if (!isAuthPage) {
        router.replace('/login');
      }
    } else {
      if (user.role === 'owner') {
        if (!pathname.startsWith('/dashboard')) {
          router.replace('/dashboard');
        }
      } else if (user.role === 'customer') {
        if (!user.infoComplete && !isCustomerInfoPage) {
          router.replace('/customer-info');
        } else if (user.infoComplete && isCustomerInfoPage) {
          router.replace('/');
        } else if (pathname.startsWith('/dashboard')) {
            router.replace('/');
        }
      }
       if (isAuthPage && user) {
         router.replace(user.role === 'owner' ? '/dashboard' : '/');
       }
    }
  }, [user, loading, pathname, router]);

  const login = async (email:string, password:string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle user state update and redirection
      return true;
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('Invalid email or password. Please try again.');
      } else {
          setError(err.message || 'An unknown error occurred.');
      }
      setLoading(false); // only set loading false on error
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setLoading(true); // To show loader while redirecting
    router.push('/login');
  };

  const refreshUser = async () => {
      if (auth.currentUser) {
          setLoading(true);
          const appUser = await getUserData(auth.currentUser.uid);
          setUser(appUser);
          setLoading(false);
      }
  }

  const value = { user, loading, error, setError, login, logout, refreshUser };
  
  // This is the key change: while loading, especially on initial server render,
  // we show a full-screen loader and don't render children.
  // This prevents any child component from trying to use Firebase on the server.
  if (loading) {
     return (
        <div className="w-full h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
};
