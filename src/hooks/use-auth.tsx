
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getUserData, signUpAndVerify } from '@/services/authService';
import type { AppUser } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  login: (email:string, password:string) => Promise<boolean>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
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
        // We need to get up-to-date user data, including emailVerified status
        await firebaseUser.reload();
        const appUser = await getUserData(firebaseUser.uid, firebaseUser.email, firebaseUser.displayName);
        
        // Combine auth state with firestore data
        if (appUser) {
          setUser({ ...appUser, emailVerified: firebaseUser.emailVerified });
        } else {
          setUser(null);
        }

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
    const isVerifyPage = pathname === '/verify-email';

    // If no user is logged in
    if (!user) {
      if (!isAuthPage && !isVerifyPage) { // Allow access to verify page for oob links
        router.replace('/login');
      }
      return;
    }

    // If a user is logged in
    if (user.role === 'customer' && !user.emailVerified) {
        if (!isVerifyPage) {
            router.replace('/verify-email');
        }
        return;
    }
    
    if (isAuthPage || isVerifyPage) {
      if (user.role === 'owner') {
        router.replace('/dashboard');
      } else {
        if (!user.infoComplete) {
            router.replace('/customer-info');
        } else {
            router.replace('/');
        }
      }
      return;
    }

    if (user.role === 'owner') {
      if (!pathname.startsWith('/dashboard')) {
        router.replace('/dashboard');
      }
    } else if (user.role === 'customer') {
      if (!user.infoComplete && !isCustomerInfoPage) {
        router.replace('/customer-info');
      }
      else if (user.infoComplete && isCustomerInfoPage) {
        router.replace('/');
      }
      else if (pathname.startsWith('/dashboard')) {
        router.replace('/');
      }
    }

  }, [user, loading, pathname, router]);

  const login = async (email:string, password:string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Let onAuthStateChanged handle the rest
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
  
  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      await signUpAndVerify(email, password, name);
      // Let onAuthStateChanged handle setting user and loading state
      return true;
    } catch (err: any) {
       console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('The password is too weak. Please use at least 6 characters.');
      } else {
        setError('An unknown error occurred during sign up.');
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
          await auth.currentUser.reload();
          const appUser = await getUserData(auth.currentUser.uid, auth.currentUser.email);
          if (appUser) {
            setUser({ ...appUser, emailVerified: auth.currentUser.emailVerified });
          }
          setLoading(false);
      }
  }
  
  const isAuthRoute = pathname === '/login' || pathname === '/customer-info' || pathname === '/verify-email';
  
  if (loading && !isAuthRoute) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, signUp, logout, refreshUser }}>
        {children}
    </AuthContext.Provider>
  );
};
