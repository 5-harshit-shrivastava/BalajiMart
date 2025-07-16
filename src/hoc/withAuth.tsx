
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/lib/types';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: UserRole[]
) => {
  const AuthComponent: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (!user) {
      // This should be handled by the AuthProvider, but as a fallback
      if (typeof window !== 'undefined') {
          router.replace('/login');
      }
      return null;
    }

    if (!allowedRoles.includes(user.role)) {
       // Redirect if role is not allowed
       if (typeof window !== 'undefined') {
         if (user.role === 'owner') {
           router.replace('/dashboard');
         } else {
           router.replace('/');
         }
       }
       return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Assign a display name for easier debugging
  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
